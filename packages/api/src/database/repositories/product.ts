import type { SqlBool } from "kysely";
import { type ExpressionBuilder, sql } from "kysely";
import { getCurrentRequestUser } from "../../request-context.js";
import { hasTenantIdColumn } from "../../utils/repository.js";
import { client } from "../client.js";
import type { Database } from "../schema/index.js";
import type { ProductImage } from "../schema/productImage.js";
import { baseRepository } from "./baseRepository.js";

const tableName = "product" as const;

type TableName = typeof tableName;

type WarehouseStock = {
    warehouse_id: string;
    warehouse_description: string;
    amount: number;
};

type SimplifiedImage = Pick<
    ProductImage,
    "id" | "tenant_id" | "product_id" | "url" | "main"
>;

const base = (db = client) =>
    baseRepository<TableName>({
        db,
        tableName: tableName,
    });

export const productRepository = (db = client) => ({
    ...base(db),

    findManyWithStocksAndImage: async ({
        page = 1,
        limit = 10,
        where,
        orderBy,
    }: {
        page: number;
        limit: number;
        where?: (eb: ExpressionBuilder<Database, TableName>) => SqlBool;
        orderBy?: {
            column: keyof Database[TableName] & string;
            direction: "asc" | "desc";
        }[];
    }) => {
        const user = getCurrentRequestUser();

        const offset = (page - 1) * limit;

        let countQuery = db
            .selectFrom(tableName)
            // @ts-expect-error
            .select(sql`count(*) as count`)
            .where(`${tableName}.deleted_at`, "is", null);

        let listQuery = db
            .selectFrom(tableName)
            .leftJoinLateral(
                (eb) =>
                    eb
                        .selectFrom("warehouse as w")
                        .leftJoin("stock as s", (join) =>
                            join
                                .onRef("s.warehouse_id", "=", "w.id")
                                .onRef("s.product_id", "=", `${tableName}.id`)
                                .on("s.deleted_at", "is", null),
                        )
                        .select([
                            sql`
                                coalesce(
                                    json_agg(
                                        json_build_object(
                                            'warehouse_id', w.id,
                                            'warehouse_description', w.description,
                                            'amount', coalesce(s.amount, 0)
                                        )
                                        ORDER BY w.description
                                    ),
                                    '[]'::json
                                )
                            `.as("stocks"),
                            sql`
                                coalesce(sum(coalesce(s.amount, 0)), 0)
                            `.as("total_in_stocks"),
                        ])
                        .whereRef("w.tenant_id", "=", `${tableName}.tenant_id`)
                        .where("w.deleted_at", "is", null)
                        .as("warehouse_stocks"),
                (join) => join.onTrue(),
            )
            .leftJoinLateral(
                (eb) =>
                    eb
                        .selectFrom("product_image as pi")
                        .select([
                            sql`
                                coalesce(
                                    json_agg(
                                        json_build_object(
                                            'id', pi.id,
                                            'tenant_id', pi.tenant_id,
                                            'product_id', pi.product_id,
                                            'url', pi.url,
                                            'main', pi.main
                                        )
                                    ),
                                    '[]'::json
                                )
                            `.as("images"),
                        ])
                        .whereRef("pi.product_id", "=", `${tableName}.id`)
                        .where("pi.deleted_at", "is", null)
                        .as("images"),
                (join) => join.onTrue(),
            )
            .selectAll(tableName)
            .select([
                sql<number>`coalesce(warehouse_stocks.total_in_stocks, 0)::float8`.as(
                    "total_in_stocks",
                ),
                sql<
                    WarehouseStock[]
                >`coalesce(warehouse_stocks.stocks, '[]'::json)`.as("stocks"),
                sql<SimplifiedImage[]>`coalesce(images.images, '[]'::json)`.as(
                    "images",
                ),
            ])
            .where(`${tableName}.deleted_at`, "is", null);

        if (where) {
            // @ts-expect-error
            countQuery = countQuery.where(where);
            // @ts-expect-error
            listQuery = listQuery.where(where);
        }

        if (orderBy) {
            for (const sort of orderBy) {
                listQuery = listQuery.orderBy(sort.column, sort.direction);
            }
        }

        if (user && hasTenantIdColumn(tableName)) {
            countQuery = countQuery.where(
                `${tableName}.tenant_id`,
                "=",
                user.tenant_id,
            );
            listQuery = listQuery.where(
                `${tableName}.tenant_id`,
                "=",
                user.tenant_id,
            );
        }

        listQuery = listQuery.orderBy("id", "desc");

        const { count } = await countQuery.executeTakeFirstOrThrow();
        const list = await listQuery.limit(limit).offset(offset).execute();

        return {
            count: Number(count),
            list,
        };
    },

    findManyWithStocksAndImageByWarehouseId: async ({
        warehouseId,
        page = 1,
        limit = 10,
        where,
        orderBy,
    }: {
        warehouseId: string;
        page: number;
        limit: number;
        where?: (eb: ExpressionBuilder<Database, TableName>) => SqlBool;
        orderBy?: {
            column: keyof Database[TableName] & string;
            direction: "asc" | "desc";
        }[];
    }) => {
        const user = getCurrentRequestUser();
        const offset = (page - 1) * limit;

        /**
         * 🔒 Filtro semântico:
         * produto só entra se tiver estoque > 0
         * no warehouse informado
         */
        const hasStockInWarehouse = (
            eb: ExpressionBuilder<Database, TableName>,
        ) =>
            eb.exists(
                eb
                    .selectFrom("stock as s")
                    .whereRef("s.product_id", "=", `${tableName}.id`)
                    .where("s.warehouse_id", "=", warehouseId)
                    .where("s.amount", ">", 0)
                    .where("s.deleted_at", "is", null),
            );

        // ==========================
        // COUNT QUERY
        // ==========================
        let countQuery = db
            .selectFrom(tableName)
            // @ts-expect-error
            .select(sql`count(*) as count`)
            .where(`${tableName}.deleted_at`, "is", null)
            .where(hasStockInWarehouse);

        // ==========================
        // LIST QUERY
        // ==========================
        let listQuery = db
            .selectFrom(tableName)
            /**
             * 📦 Estoque do warehouse específico
             */
            .leftJoinLateral(
                (eb) =>
                    eb
                        .selectFrom("stock as s")
                        .innerJoin("warehouse as w", "w.id", "s.warehouse_id")
                        .select([
                            sql`
              json_build_object(
                'warehouse_id', w.id,
                'warehouse_description', w.description,
                'amount', s.amount
              )
            `.as("stock"),
                            sql<number>`s.amount::float8`.as("total_in_stocks"),
                        ])
                        .whereRef("s.product_id", "=", `${tableName}.id`)
                        .where("s.warehouse_id", "=", warehouseId)
                        .where("s.amount", ">", 0)
                        .where("s.deleted_at", "is", null)
                        .where("w.deleted_at", "is", null)
                        .as("warehouse_stock"),
                (join) => join.onTrue(),
            )
            /**
             * 🖼️ Imagens do produto
             */
            .leftJoinLateral(
                (eb) =>
                    eb
                        .selectFrom("product_image as pi")
                        .select([
                            sql`
              coalesce(
                json_agg(
                  json_build_object(
                    'id', pi.id,
                    'tenant_id', pi.tenant_id,
                    'product_id', pi.product_id,
                    'url', pi.url,
                    'main', pi.main
                  )
                ),
                '[]'::json
              )
            `.as("images"),
                        ])
                        .whereRef("pi.product_id", "=", `${tableName}.id`)
                        .where("pi.deleted_at", "is", null)
                        .as("images"),
                (join) => join.onTrue(),
            )
            .selectAll(tableName)
            .select([
                sql<number>`warehouse_stock.total_in_stocks`.as(
                    "total_in_stocks",
                ),
                sql`warehouse_stock.stock`.as("stocks"),
                sql<SimplifiedImage[]>`coalesce(images.images, '[]'::json)`.as(
                    "images",
                ),
            ])
            .where(`${tableName}.deleted_at`, "is", null)
            .where(hasStockInWarehouse);

        // ==========================
        // WHERE dinâmico
        // ==========================
        if (where) {
            // @ts-expect-error
            countQuery = countQuery.where(where);
            // @ts-expect-error
            listQuery = listQuery.where(where);
        }

        // ==========================
        // TENANT
        // ==========================
        if (user && hasTenantIdColumn(tableName)) {
            countQuery = countQuery.where(
                `${tableName}.tenant_id`,
                "=",
                user.tenant_id,
            );
            listQuery = listQuery.where(
                `${tableName}.tenant_id`,
                "=",
                user.tenant_id,
            );
        }

        // ==========================
        // ORDER BY
        // ==========================
        if (orderBy) {
            for (const sort of orderBy) {
                listQuery = listQuery.orderBy(sort.column, sort.direction);
            }
        }

        listQuery = listQuery.orderBy("id", "desc");

        // ==========================
        // EXECUÇÃO
        // ==========================
        const { count } = await countQuery.executeTakeFirstOrThrow();
        const list = await listQuery.limit(limit).offset(offset).execute();

        return {
            count: Number(count),
            list,
        };
    },
});
