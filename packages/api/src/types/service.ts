import type {
    ExpressionBuilder,
    Insertable,
    Selectable,
    SqlBool,
    Updateable,
} from "kysely";

import type { Database } from "../database/schema/index.js";

export interface BaseService<K extends keyof Database> {
    findOneById(id: string): Promise<Selectable<Database[K]> | null>;

    findOneByCondition(
        where: (eb: ExpressionBuilder<Database, K>) => SqlBool,
    ): Promise<Selectable<Database[K]> | null>;

    findMany(params: {
        page: number;
        limit: number;
        where?: (eb: ExpressionBuilder<Database, K>) => SqlBool;
        orderBy?: {
            column: keyof Database[K] & string;
            direction: "asc" | "desc";
        }[];
    }): Promise<{ count: number; list: Selectable<Database[K]>[] }>;

    create(data: Insertable<Database[K]>): Promise<Selectable<Database[K]>>;

    updateById(params: {
        id: string;
        data: Updateable<Database[K]>;
    }): Promise<Selectable<Database[K]>>;

    deleteById(id: string): Promise<Selectable<Database[K]>>;
}
