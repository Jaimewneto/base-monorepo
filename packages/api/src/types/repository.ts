import type {
    ExpressionBuilder,
    Insertable,
    Selectable,
    SqlBool,
    Transaction,
    Updateable,
} from "kysely";

import type { Database } from "../database/schema/index.js";

export interface BaseRepository<K extends keyof Database> {
    getTableName(): K;

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

    create(params: {
        data: Insertable<Database[K]>;
        client?: Transaction<Database>;
    }): Promise<Selectable<Database[K]>>;

    updateById(params: {
        id: string;
        data: Updateable<Database[K]>;
        client?: Transaction<Database>;
    }): Promise<Selectable<Database[K]>>;

    deleteById(params: {
        id: string;
        client?: Transaction<Database>;
    }): Promise<Selectable<Database[K]>>;
}
