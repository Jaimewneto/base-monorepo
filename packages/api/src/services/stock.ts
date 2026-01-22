import type { SqlBool } from "kysely";

import { client } from "../database/client.js";

import { cardexRepository } from "../database/repositories/cardex.js";
import { stockRepository } from "../database/repositories/stock.js";
import { BadRequestError } from "../error.js";
import { getCurrentRequestUser } from "../request-context.js";
import { baseService } from "./baseService.js";

const base = baseService<"stock">(stockRepository(client));

export const stockService = {
    ...base,

    createOrUpdate: async ({
        company_id,
        warehouse_id,
        product_id,
        amount,
    }: {
        company_id: string;
        warehouse_id: string;
        product_id: string;
        amount: number;
    }) => {
        return await client.transaction().execute(async (trx) => {
            const stockRepo = stockRepository(trx);
            const cardexRepo = cardexRepository(trx);

            const existingStock = await stockRepo.findOneByCondition(
                (eb) =>
                    eb.and([
                        eb("stock.warehouse_id", "=", warehouse_id),
                        eb("stock.product_id", "=", product_id),
                    ]) as unknown as SqlBool,
            );

            if (existingStock) {
                const amountDifference = amount - existingStock.amount;

                if (amountDifference > 0) {
                    await cardexRepo.create({
                        company_id: existingStock.company_id,
                        warehouse_id,
                        product_id,
                        description: "Alteração manual de estoque",
                        entry: amountDifference,
                        exit: 0,
                    });
                }

                if (amountDifference < 0) {
                    await cardexRepo.create({
                        company_id: existingStock.company_id,
                        warehouse_id,
                        product_id,
                        description: "Alteração manual de estoque",
                        entry: 0,
                        exit: Math.abs(amountDifference),
                    });
                }

                if (amountDifference === 0) {
                    return existingStock;
                }

                return await stockRepo.updateById({
                    id: existingStock.id,
                    data: { amount },
                });
            }

            if (amount === 0) {
                throw new BadRequestError({
                    message:
                        "Não é possível criar um estoque com quantidade zero",
                });
            }

            await cardexRepo.create({
                company_id,
                warehouse_id,
                product_id,
                description: "Alteração manual de estoque",
                entry: amount,
                exit: 0,
            });

            return await stockRepo.create({
                company_id,
                warehouse_id,
                product_id,
                amount,
            });
        });
    },
};
