import type {
    MultiTable,
    SmartFieldAny,
    SmartFieldMulti,
    SmartFieldSingle,
} from "./where.js";

export interface OrderBy<
    T = undefined,
    TableName extends string | undefined = undefined,
> {
    field: T extends MultiTable<infer M>
        ? SmartFieldMulti<M>
        : T extends Record<string, any>
          ? SmartFieldSingle<T, TableName extends string ? TableName : never>
          : SmartFieldAny;
    direction: "asc" | "desc";
}
