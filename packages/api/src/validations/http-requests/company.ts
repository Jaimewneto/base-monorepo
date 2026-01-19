import z from "zod/v4";
import { database } from "../../database/constSchema.js";
import type {
    CompanyCreate,
    CompanyUpdate,
} from "../../database/schema/company.js";
import type { CheckSchema } from "../../types/validation.js";
import { queryRequestsValidations } from "./query.js";
import { userRequestsValidations } from "./user.js";

const { create: userCreate } = userRequestsValidations();

export const companyRequestsValidations = () => {
    const findOneById = z.object({
        id: z.uuid(),
    });

    const findMany = queryRequestsValidations({
        tableName: database.companyTable.name,
        tableKeys: database.companyTable.keys,
    }).WhereSortSchema.extend({
        limit: z.number().int().default(10),
        page: z.number().int().default(1),
    });

    const create = z.object({
        name: z.string().min(2).max(100),
    } satisfies CheckSchema<CompanyCreate>);

    const createWithUser = z.object({
        company: create,
        user: userCreate,
    });

    const updateById = z.object({
        name: z.string().min(2).max(100).optional(),
    } satisfies CheckSchema<CompanyUpdate>);

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
