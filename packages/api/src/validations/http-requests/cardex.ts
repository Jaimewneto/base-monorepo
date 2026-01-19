import z from "zod/v4";
import { database } from "../../database/constSchema.js";
import type { CardexCreateWithoutCompanyId } from "../../database/schema/cardex.js";
import type { CheckSchema } from "../../types/validation.js";
import { queryRequestsValidations } from "./query.js";

export const cardexRequestsValidations = () => {
    const findMany = queryRequestsValidations({
        tableName: database.cardexTable.name,
        tableKeys: database.cardexTable.keys,
    }).WhereSortSchema.extend({
        limit: z.number().int().default(10),
        page: z.number().int().default(1),
    });

    const create = z.object({
        product_id: z.uuid(),
        warehouse_id: z.uuid(),
        entry: z.number().min(0).default(0),
        exit: z.number().min(0).default(0),
        description: z.string().min(2).max(100),
    } satisfies CheckSchema<CardexCreateWithoutCompanyId>);

    return {
        findMany,
        create,
    };
};
