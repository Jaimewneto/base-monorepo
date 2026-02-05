import type { SqlBool } from "kysely";

import type { Database } from "../database/schema/index.js";

import { productService } from "../services/product.js";
import type { OrderBy } from "../types/http-query/orderBy.js";
import type { Where } from "../types/http-query/where.js";
import type { ZodSortMap, ZodWhereMap } from "../types/http-query/zod.js";
import { buildOrderBy, buildWhereExpression } from "../utils/http-query.js";

import { baseController } from "./baseController.js";

export const base = baseController<"product">(productService);

export const productController = {
    ...base,

    findManyWithInventoriesAndImage: async ({
        limit,
        page,
        where,
        sort,
    }: {
        limit: number;
        page: number;
        where?: ZodWhereMap["product"];
        sort?: ZodSortMap["product"];
    }) => {
        const finalWhere =
            where &&
            buildWhereExpression<"product">(
                where as Where<Database["product"], "product">,
            );
        const orderBy = buildOrderBy<"product">(
            sort as OrderBy<Database["product"], "product">[],
        );

        return await productService.findManyWithInventoriesAndImage({
            limit,
            page,
            where: finalWhere
                ? (eb) => finalWhere(eb) as unknown as SqlBool
                : undefined,
            orderBy,
        });
    },

    findManyWithInventoriesAndImageByWarehouseId: async ({
        warehouseId,
        limit,
        page,
        where,
        sort,
    }: {
        warehouseId: string;
        limit: number;
        page: number;
        where?: ZodWhereMap["product"];
        sort?: ZodSortMap["product"];
    }) => {
        const finalWhere =
            where &&
            buildWhereExpression<"product">(
                where as Where<Database["product"], "product">,
            );
        const orderBy = buildOrderBy<"product">(
            sort as OrderBy<Database["product"], "product">[],
        );

        return await productService.findManyWithInventoriesAndImageByWarehouseId(
            {
                warehouseId,
                limit,
                page,
                where: finalWhere
                    ? (eb) => finalWhere(eb) as unknown as SqlBool
                    : undefined,
                orderBy,
            },
        );
    },
};
