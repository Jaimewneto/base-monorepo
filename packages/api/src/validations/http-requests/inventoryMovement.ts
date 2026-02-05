import { database } from "../../database/constSchema.js";
import type { InventoryMovementCreateWithoutTenantId } from "../../database/schema/inventoryMovement.js";
import type { CheckSchema } from "../../types/validation.js";
import { zod as z } from "./index.js";
import { queryRequestsValidations } from "./query.js";

export const inventoryMovementRequestsValidations = () => {
    const findMany = queryRequestsValidations({
        tableName: database.inventoryMovementTable.name,
        tableKeys: database.inventoryMovementTable.keys,
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
    } satisfies CheckSchema<InventoryMovementCreateWithoutTenantId>);

    return {
        findMany,
        create,
    };
};
