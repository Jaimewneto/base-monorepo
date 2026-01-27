import type { SqlBool } from "kysely";
import { client } from "../database/client.js";

import { stockRepository } from "../database/repositories/stock.js";
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
            const stockRepositoryInstance = stockRepository(trx);

            const stocks = await stockRepositoryInstance.findMany({
                page: 1,
                limit: 1,
                where: (eb) =>
                    eb.and([
                        eb("stock.warehouse_id", "=", id),
                        eb("stock.amount", ">", 0),
                    ]) as unknown as SqlBool,
            });

            if (stocks.count > 0) {
                throw new BadRequestError({
                    message: getErrorMessage({
                        key: "cannotDeleteWarehouseWithExistingStock",
                    }),
                });
            }

            return await base.deleteById(id);
        });
    },
};
