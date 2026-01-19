import z from "zod/v4";

import { database } from "../../database/constSchema.js";

import { queryRequestsValidations } from "./query.js";

export const auditRequestsValidations = () => {
    const findOneById = z.object({
        id: z.uuid(),
    });

    const findMany = queryRequestsValidations({
        tableName: database.auditTable.name,
        tableKeys: database.auditTable.keys,
    }).WhereSortSchema.extend({
        limit: z.number().int().default(10),
        page: z.number().int().default(1),
    });

    return {
        findOneById,
        findMany,
    };
};
