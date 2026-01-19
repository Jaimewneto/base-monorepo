import z from "zod/v4";

import { database } from "../../database/constSchema.js";

import type {
    ProductCreateWithoutCompanyId,
    ProductUpdate,
} from "../../database/schema/product.js";

import type { CheckSchema } from "../../types/validation.js";

import { queryRequestsValidations } from "./query.js";

export const productRequestsValidations = () => {
    const findOneById = z.object({
        id: z.uuid(),
    });

    const findMany = queryRequestsValidations({
        tableName: database.productTable.name,
        tableKeys: database.productTable.keys,
    }).WhereSortSchema.extend({
        limit: z.number().int().default(10),
        page: z.number().int().default(1),
    });

    const create = z.object({
        description: z.string().min(2).max(100),
        internal_code: z.string().min(2).max(100),
        sku: z.string().min(2).max(100),
        observations: z.string().min(2).max(100).optional(),
    } satisfies CheckSchema<ProductCreateWithoutCompanyId>);

    const updateById = z.object({
        description: z.string().min(2).max(100),
        internal_code: z.string().min(2).max(100),
        sku: z.string().min(2).max(100),
        observations: z.string().min(2).max(100).optional(),
    } satisfies CheckSchema<ProductUpdate>);

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
