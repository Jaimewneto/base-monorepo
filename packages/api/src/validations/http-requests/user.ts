import z from "zod/v4";
import { database } from "../../database/constSchema.js";
import type {
    UserCreateWithoutTenantId,
    UserUpdate,
} from "../../database/schema/user.js";
import type { CheckSchema } from "../../types/validation.js";
import { queryRequestsValidations } from "./query.js";

export const userRequestsValidations = () => {
    const findOneById = z.object({
        id: z.uuid(),
    });

    const findMany = queryRequestsValidations({
        tableName: database.userTable.name,
        tableKeys: database.userTable.keys,
    }).WhereSortSchema.extend({
        limit: z.number().int().default(10),
        page: z.number().int().default(1),
    });

    const create = z.object({
        name: z.string().min(2).max(100),
        email: z.email(),
        password: z.string().min(6).max(100),
    } satisfies CheckSchema<UserCreateWithoutTenantId>);

    const updateById = z.object({
        name: z.string().min(2).max(100).optional(),
    } satisfies CheckSchema<UserUpdate>);

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
