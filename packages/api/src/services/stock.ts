import type { SqlBool } from "kysely";

import { client } from "../database/client.js";

import { inventoryMovementRepository } from "../database/repositories/inventoryMovement.js";
import { stockRepository } from "../database/repositories/stock.js";
import { BadRequestError } from "../error.js";
import { getErrorMessage } from "../utils/messageTranslator.js";
import { baseService } from "./baseService.js";

const base = baseService<"stock">(stockRepository(client));

export const stockService = {
    ...base,

    createOrUpdate: async ({
        tenant_id,
        warehouse_id,
        product_id,
        amount,
    }: {
        tenant_id: string;
        warehouse_id: string;
        product_id: string;
        amount: number;
    }) => {
        return await client.transaction().execute(async (trx) => {
            const stockRepo = stockRepository(trx);
            const inventoryMovementRepo = inventoryMovementRepository(trx);

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
                    await inventoryMovementRepo.create({
                        tenant_id: existingStock.tenant_id,
                        warehouse_id,
                        product_id,
                        description: "Alteração manual de estoque", // TODO: Description by language
                        entry: amountDifference,
                        exit: 0,
                    });
                }

                if (amountDifference < 0) {
                    await inventoryMovementRepo.create({
                        tenant_id: existingStock.tenant_id,
                        warehouse_id,
                        product_id,
                        description: "Alteração manual de estoque", // TODO: Description by language
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
                    message: getErrorMessage({
                        key: "cannotCreateStockWithZeroAmount",
                    }),
                });
            }

            await inventoryMovementRepo.create({
                tenant_id,
                warehouse_id,
                product_id,
                description: "Alteração manual de estoque", // TODO: Description by language
                entry: amount,
                exit: 0,
            });

            return await stockRepo.create({
                tenant_id,
                warehouse_id,
                product_id,
                amount,
            });
        });
    },
};
