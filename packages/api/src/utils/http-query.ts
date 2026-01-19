import {
    type ExpressionBuilder,
    type ExpressionWrapper,
    type Operator,
    type SqlBool,
    type StringReference,
    sql,
} from "kysely";

import type { Database } from "../database/schema/index.js";
import type { OrderBy } from "../types/http-query/orderBy.js";
import type { Where } from "../types/http-query/where.js";

type AnyCondition<K extends keyof Database> = {
    field: StringReference<Database, K>;
    operator: Operator;
    value: unknown;
};

type AnyClause<K extends keyof Database> = {
    junction: "and" | "or";
    conditions: (AnyCondition<K> | AnyClause<K>)[];
};

const buildCondition = <K extends keyof Database>(
    eb: ExpressionBuilder<Database, K>,
    condition: AnyCondition<K>,
): ExpressionWrapper<Database, K, SqlBool> => {
    const operator = condition.operator.toLowerCase();

    const ref = eb.ref(condition.field);

    switch (operator) {
        case "=":
        case "!=":
        case "<>":
        case ">":
        case ">=":
        case "<":
        case "<=":
            return eb(ref, operator, condition.value as any); // Could be better...

        case "like":
        case "ilike":
            return eb(
                eb.fn("unaccent", [ref]),
                operator,
                eb.fn("unaccent", [sql`${condition.value}`]),
            )

        case "in":
        case "not in":
            if (!Array.isArray(condition.value)) {
                throw new Error(`${operator} expects array value`);
            }
            return eb(ref, operator, condition.value);

        case "between":
            if (
                !Array.isArray(condition.value) ||
                condition.value.length !== 2
            ) {
                throw new Error("BETWEEN expects [min, max]");
            }
            return eb.between(
                ref,
                condition.value[0] as any, // Could be better...
                condition.value[1] as any, // Could be better...
            );

        case "is":
        case "is not":
            return eb(ref, operator, sql`${condition.value}` as any); // Aparently it can only handle NULL, NOT NULL, TRUE, FALSE

        default:
            throw new Error(`Unsupported operator: ${condition.operator}`);
    }
};

const buildClause = <K extends keyof Database>(
    eb: ExpressionBuilder<Database, K>,
    clause: AnyClause<K>,
): ExpressionWrapper<Database, K, SqlBool> => {
    const expressions = clause.conditions.map((c) =>
        "junction" in c ? buildClause(eb, c) : buildCondition(eb, c),
    );

    return clause.junction === "or" ? eb.or(expressions) : eb.and(expressions);
};

export const buildWhereExpression = <K extends keyof Database>(
    where?: Where<Database[K], K & string>,
):
    | ((
          eb: ExpressionBuilder<Database, K>,
      ) => ExpressionWrapper<Database, K, SqlBool>)
    | undefined => {
    if (!where) return undefined;

    return (eb) => buildClause(eb, where as AnyClause<K>);
};

export const buildOrderBy = <K extends keyof Database>(
    sort?: OrderBy<Database[K], K & string>[] | undefined,
):
    | { column: keyof Database[K] & string; direction: "asc" | "desc" }[]
    | undefined => {
    if (!sort || sort.length === 0) return undefined;

    return sort.map((orderBy) => ({
        column: orderBy.field as keyof Database[K] & string,
        direction: orderBy.direction || "asc",
    }));
};
