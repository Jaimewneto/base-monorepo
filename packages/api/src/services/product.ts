import type { ExpressionBuilder, SqlBool } from "kysely";

import { client } from "../database/client.js";

import { productRepository } from "../database/repositories/product.js";
import { stockRepository } from "../database/repositories/stock.js";
import type { Database } from "../database/schema/index.js";
import { BadRequestError } from "../error.js";
import { getErrorMessage } from "../utils/messageTranslator.js";
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

    deleteById: async (id: string) => {
        return await client.transaction().execute(async (trx) => {
            const base = baseService<"product">(productRepository(trx));
            const stockRepositoryInstance = stockRepository(trx);

            const stocks = await stockRepositoryInstance.findMany({
                page: 1,
                limit: 1,
                where: (eb) =>
                    eb.and([
                        eb("stock.product_id", "=", id),
                        eb("stock.amount", ">", 0),
                    ]) as unknown as SqlBool,
            });

            if (stocks.count > 0) {
                throw new BadRequestError({
                    message: getErrorMessage({
                        key: "cannotDeleteProductWithExistingStock",
                    }),
                });
            }

            return await base.deleteById(id);
        });
    },
};
