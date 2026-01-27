import type { Database } from "../../database/schema/index.js";
import { zod as z } from "./index.js";

export const queryRequestsValidations = <K extends keyof Database>({
    tableName,
    tableKeys,
}: {
    tableName: K;
    tableKeys: readonly (keyof Database[K] & string)[];
}) => {
    const makeQualifiedFields = (
        tableName: K,
        keys: readonly (keyof Database[K] & string)[],
    ) => keys.map((k) => `${tableName}.${k}` as const);

    const PostgresComparisonOperators = z.enum([
        "=",
        "!=",
        "<>",
        ">",
        ">=",
        "<",
        "<=",
        "like",
        "not like",
        "ilike",
        "not ilike",
        "in",
        "not in",
        "is",
        "is not",
        "between",
    ]);

    const ConditionZodSchema = z
        .object({
            field: z.enum(makeQualifiedFields(tableName, tableKeys)),
            operator: PostgresComparisonOperators,
            value: z.any(),
        })
        .superRefine((data, ctx) => {
            const op = data.operator;

            if (["in", "not in"].includes(op)) {
                if (!Array.isArray(data.value)) {
                    ctx.addIssue({
                        code: "custom",
                        message: `${op} expects array value`,
                    });
                }
            }

            if (op === "between") {
                if (!Array.isArray(data.value) || data.value.length !== 2) {
                    ctx.addIssue({
                        code: "custom",
                        message: "between expects [min, max]",
                    });
                }
            }

            if (["is", "is not"].includes(op)) {
                if (![null, true, false].includes(data.value)) {
                    ctx.addIssue({
                        code: "custom",
                        message: `${op} only supports null, true or false`,
                    });
                }
            }
        });

    const WhereZodSchema: z.ZodType = z.object({
        junction: z.enum(["and", "or"]).default("and"),
        conditions: z.array(
            z.lazy(() => z.union([ConditionZodSchema, WhereZodSchema])),
        ),
    });

    const OrderByFieldSchema = z
        .object({
            field: z.enum(makeQualifiedFields(tableName, tableKeys)),
            direction: z.enum(["asc", "desc"]),
        })
        .refine((data) => !("raw" in data), {
            message: "Não pode enviar 'raw' junto com 'field' e 'direction'",
        });

    const WhereSortSchema = z.object({
        where: z
            .object({
                junction: z.enum(["and", "or"]).default("and"),
                conditions: z.array(
                    z.union([
                        ConditionZodSchema,
                        z.object({
                            junction: z.enum(["and", "or"]).default("and"),
                            conditions: z.array(ConditionZodSchema),
                        }),
                    ]),
                ),
            })
            .optional(),
        sort: z.array(OrderByFieldSchema).optional(),
    });

    return {
        WhereSortSchema,
    };
};
