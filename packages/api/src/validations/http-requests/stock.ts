import { database } from "../../database/constSchema.js";
import { zod as z } from "./index.js";
import { queryRequestsValidations } from "./query.js";

export const stockRequestsValidations = () => {
    const findOneById = z.object({
        id: z.uuid(),
    });

    const findMany = queryRequestsValidations({
        tableName: database.stockTable.name,
        tableKeys: database.stockTable.keys,
    }).WhereSortSchema.extend({
        limit: z.number().int().default(10),
        page: z.number().int().default(1),
    });

    const createOrUpdate = z.object({
        warehouse_id: z.uuid(),
        product_id: z.uuid(),
        amount: z.number().int().min(0),
    });

    return {
        findOneById,
        findMany,
        createOrUpdate,
    };
};
