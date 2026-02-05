import type { SqlBool } from "kysely";
import { client } from "../database/client.js";

import { inventoryRepository } from "../database/repositories/inventory.js";
import { warehouseRepository } from "../database/repositories/warehouse.js";
import { BadRequestError } from "../error.js";
import { getErrorMessage } from "../utils/messageTranslator.js";
import { baseService } from "./baseService.js";

const base = baseService<"warehouse">(warehouseRepository(client));

export const warehouseService = {
    ...base,

    deleteById: async (id: string) => {
        return await client.transaction().execute(async (trx) => {
            const base = baseService<"warehouse">(warehouseRepository(trx));
            const inventoryRepositoryInstance = inventoryRepository(trx);

            const inventorys = await inventoryRepositoryInstance.findMany({
                page: 1,
                limit: 1,
                where: (eb) =>
                    eb.and([
                        eb("inventory.warehouse_id", "=", id),
                        eb("inventory.amount", ">", 0),
                    ]) as unknown as SqlBool,
            });

            if (inventorys.count > 0) {
                throw new BadRequestError({
                    message: getErrorMessage({
                        key: "cannotDeleteWarehouseWithExistingInventory",
                    }),
                });
            }

            return await base.deleteById(id);
        });
    },
};
