import z from "zod/v4";
import { database } from "../../database/constSchema.js";
import type {
    WarehouseCreateWithoutCompanyId,
    WarehouseUpdate,
} from "../../database/schema/warehouse.js";
import type { CheckSchema } from "../../types/validation.js";
import { queryRequestsValidations } from "./query.js";

export const warehouseRequestsValidations = () => {
    const findOneById = z.object({
        id: z.uuid(),
    });

    const findMany = queryRequestsValidations({
        tableName: database.warehouseTable.name,
        tableKeys: database.warehouseTable.keys,
    }).WhereSortSchema.extend({
        limit: z.number().int().default(10),
        page: z.number().int().default(1),
    });

    const create = z.object({
        description: z.string().min(2).max(100),
        observations: z.string().min(2).max(100).nullable().optional(),
    } satisfies CheckSchema<WarehouseCreateWithoutCompanyId>);

    const updateById = z.object({
        description: z.string().min(2).max(100),
        observations: z.string().min(2).max(100).nullable().optional(),
    } satisfies CheckSchema<WarehouseUpdate>);

    const deleteById = z.object({
        id: z.uuid(),
    });

    return {
        findOneById,
        findMany,
        create,
        updateById,
        deleteById,
    };
};
