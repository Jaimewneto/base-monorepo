import type {
    ExpressionBuilder,
    Insertable,
    Selectable,
    SqlBool,
    Updateable,
} from "kysely";

import type { Database } from "../database/schema/index.js";

import type { ZodSortMap, ZodWhereMap } from "./http-query/zod.js";

export interface BaseController<K extends keyof Database> {
    findOneById(id: string): Promise<Selectable<Database[K]>>;

    findOneByCondition(
        where: (eb: ExpressionBuilder<Database, K>) => SqlBool,
    ): Promise<Selectable<Database[K]>>;

    findMany(params: {
        page: number;
        limit: number;
        where?: ZodWhereMap[K];
        sort?: ZodSortMap[K];
    }): Promise<{ count: number; list: Selectable<Database[K]>[] }>;

    create(data: Insertable<Database[K]>): Promise<Selectable<Database[K]>>;

    updateById(params: {
        id: string;
        data: Updateable<Database[K]>;
    }): Promise<Selectable<Database[K]>>;

    deleteById(id: string): Promise<Selectable<Database[K]>>;
}
