import type { OrderBy } from "./orderBy.js";
import type { Select } from "./select.js";
import type { Where } from "./where.js";

export interface QueryOne<
    T = undefined,
    TableName extends string | undefined = undefined,
> {
    select: Select<T, TableName>;
    where: Where<T, TableName>;
}

export interface QueryMany<
    T = undefined,
    TableName extends string | undefined = undefined,
> {
    select?: Select<T, TableName>;
    where?: Where<T, TableName>;
    orderBy?: OrderBy<T, TableName>[];
    limit?: number;
    offset?: number;
}
