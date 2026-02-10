import { database } from "../../database/constSchema.js";
import type {
    ProductCreateWithoutTenantId,
    ProductUpdate,
} from "../../database/schema/product.js";
import type { CheckSchema } from "../../types/validation.js";
import { zod as z } from "./index.js";

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
        sku: z.string().min(2).max(100),
        description: z.string().min(2).max(100),
        mpn: z.string().max(100).nullable().optional(),
        gtin: z.string().min(8).max(14).nullable().optional(),
        ncm: z.string().min(8).max(8).nullable().optional(),
        default_price: z.number().min(0.01),
        unit_of_measure: z.string().min(2).max(100),
        observations: z.string().min(2).max(100).nullable().optional(),
    } satisfies CheckSchema<ProductCreateWithoutTenantId>);

    const updateById = z.object({
        sku: z.string().min(2).max(100),
        description: z.string().min(2).max(100),
        mpn: z.string().max(100).nullable().optional(),
        gtin: z.string().min(8).max(14).nullable().optional(),
        ncm: z.string().min(8).max(8).nullable().optional(),
        default_price: z.number().min(0.01),
        unit_of_measure: z.string().min(2).max(100),
        observations: z.string().min(2).max(100).nullable().optional(),
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
