import type { ExpressionBuilder, SqlBool } from "kysely";

import { client } from "../database/client.js";

import { productRepository } from "../database/repositories/product.js";
import type { Database } from "../database/schema/index.js";
import { baseService } from "./baseService.js";

const base = baseService<"product">(productRepository(client));

export const productService = {
    ...base,

    findManyWithStock: async ({
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
        return await productRepository(client).findManyWithStock({
            limit,
            page,
            where,
            orderBy,
        });
    },
};
