import type {
    MultiTable,
    SmartFieldAny,
    SmartFieldMulti,
    SmartFieldSingle,
} from "./where.js";

export type Select<
    T = undefined,
    TableName extends string | undefined = undefined,
> = T extends MultiTable<infer M>
    ? SmartFieldMulti<M>[]
    : T extends Record<string, any>
      ? SmartFieldSingle<T, TableName extends string ? TableName : never>[]
      : SmartFieldAny[];
