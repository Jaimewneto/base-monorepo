import type { SqlBool } from "kysely";

import { client } from "../database/client.js";
import { inventoryRepository } from "../database/repositories/inventory.js";
import { inventoryMovementRepository } from "../database/repositories/inventoryMovement.js";
import { BadRequestError } from "../error.js";
import { getErrorMessage } from "../utils/messageTranslator.js";
import { baseService } from "./baseService.js";

const base = baseService<"inventory">(inventoryRepository(client));

export const inventoryService = {
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
            const inventoryRepo = inventoryRepository(trx);
            const inventoryMovementRepo = inventoryMovementRepository(trx);

            const existingInventory = await inventoryRepo.findOneByCondition(
                (eb) =>
                    eb.and([
                        eb("inventory.warehouse_id", "=", warehouse_id),
                        eb("inventory.product_id", "=", product_id),
                    ]) as unknown as SqlBool,
            );

            if (existingInventory) {
                const amountDifference = amount - existingInventory.amount;

                if (amountDifference > 0) {
                    await inventoryMovementRepo.create({
                        tenant_id: existingInventory.tenant_id,
                        warehouse_id,
                        product_id,
                        description: "Alteração manual de estoque", // TODO: Description by language
                        entry: amountDifference,
                        exit: 0,
                    });
                }

                if (amountDifference < 0) {
                    await inventoryMovementRepo.create({
                        tenant_id: existingInventory.tenant_id,
                        warehouse_id,
                        product_id,
                        description: "Alteração manual de estoque", // TODO: Description by language
                        entry: 0,
                        exit: Math.abs(amountDifference),
                    });
                }

                if (amountDifference === 0) {
                    return existingInventory;
                }

                return await inventoryRepo.updateById({
                    id: existingInventory.id,
                    data: { amount },
                });
            }

            if (amount === 0) {
                throw new BadRequestError({
                    message: getErrorMessage({
                        key: "cannotCreateInventoryWithZeroAmount",
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

            return await inventoryRepo.create({
                tenant_id,
                warehouse_id,
                product_id,
                amount,
            });
        });
    },
};
