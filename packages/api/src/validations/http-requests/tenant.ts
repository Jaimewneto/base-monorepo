import { database } from "../../database/constSchema.js";
import type {
    TenantCreate,
    TenantUpdate,
} from "../../database/schema/tenant.js";
import type { CheckSchema } from "../../types/validation.js";
import { zod as z } from "./index.js";
import { queryRequestsValidations } from "./query.js";
import { userRequestsValidations } from "./user.js";

const { create: userCreate } = userRequestsValidations();

export const tenantRequestsValidations = () => {
    const findOneById = z.object({
        id: z.uuid(),
    });

    const findMany = queryRequestsValidations({
        tableName: database.tenantTable.name,
        tableKeys: database.tenantTable.keys,
    }).WhereSortSchema.extend({
        limit: z.number().int().default(10),
        page: z.number().int().default(1),
    });

    const create = z.object({
        name: z.string().min(2).max(100),
    } satisfies CheckSchema<TenantCreate>);

    const createWithUser = z.object({
        tenant: create,
        user: userCreate,
    });

    const updateById = z.object({
        name: z.string().min(2).max(100).optional(),
    } satisfies CheckSchema<TenantUpdate>);

    const deleteById = z.object({
        id: z.uuid(),
    });

    return {
        findOneById,
        findMany,
        create,
        createWithUser,
        updateById,
        deleteById,
    };
};
