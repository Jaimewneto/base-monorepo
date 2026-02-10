import type { ExpressionBuilder, SqlBool } from "kysely";

import { client } from "../database/client.js";
import { inventoryRepository } from "../database/repositories/inventory.js";
import { productRepository } from "../database/repositories/product.js";
import type { Database } from "../database/schema/index.js";
import type {
    ProductCreate,
    ProductUpdate,
} from "../database/schema/product.js";
import { BadRequestError } from "../error.js";
import { productRules } from "../rules/product.js";
import { getMessage } from "../utils/messageTranslator.js";
import { baseService } from "./baseService.js";

const base = baseService<"product">(productRepository(client));

export const productService = {
    ...base,

    findManyWithInventoriesAndImage: async ({
        limit,
        page,
        where,
        orderBy,
    }: {
        limit: number;
        page: number;
        where?: (eb: ExpressionBuilder<Database, "product">) => SqlBool;
        orderBy?: {
            column: keyof Database["product"] & string;
            direction: "asc" | "desc";
        }[];
    }) => {
        return await productRepository(client).findManyWithInventoriesAndImage({
            limit,
            page,
            where,
            orderBy,
        });
    },

    findManyWithInventoriesAndImageByWarehouseId: async ({
        warehouseId,
        limit,
        page,
        where,
        orderBy,
    }: {
        warehouseId: string;
        limit: number;
        page: number;
        where?: (eb: ExpressionBuilder<Database, "product">) => SqlBool;
        orderBy?: {
            column: keyof Database["product"] & string;
            direction: "asc" | "desc";
        }[];
    }) => {
        return await productRepository(
            client,
        ).findManyWithInventoriesAndImageByWarehouseId({
            warehouseId,
            limit,
            page,
            where,
            orderBy,
        });
    },

    create: async (data: ProductCreate) => {
        await productRules({ db: client }).validateCreate(data);

        return await productRepository(client).create({ data });
    },

    update: async ({ id, data }: { id: string; data: ProductUpdate }) => {
        await productRules({ db: client }).validateUpdate(data);

        return await productRepository(client).updateById({ id, data });
    },

    deleteById: async (id: string) => {
        return await client.transaction().execute(async (trx) => {
            const base = baseService<"product">(productRepository(trx));
            const inventoryRepositoryInstance = inventoryRepository(trx);

            const inventorys = await inventoryRepositoryInstance.findMany({
                page: 1,
                limit: 1,
                where: (eb) =>
                    eb.and([
                        eb("inventory.product_id", "=", id),
                        eb("inventory.amount", ">", 0),
                    ]) as unknown as SqlBool,
            });

            if (inventorys.count > 0) {
                throw new BadRequestError({
                    message: getMessage({
                        key: "cannotDeleteProductWithExistingInventory",
                    }),
                });
            }

            return await base.deleteById(id);
        });
    },
};
