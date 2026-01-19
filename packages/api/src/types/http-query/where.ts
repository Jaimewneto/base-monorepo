import type { Operator } from "kysely";

type ValueTypes = string | number | boolean | bigint | null;

export type SmartFieldMulti<T extends Record<string, any>> = {
    [K in keyof T]: `${K & string}.${Extract<keyof T[K], string>}`;
}[keyof T];

export type SmartFieldSingle<T, TableName extends string> =
    | `${TableName}.${Extract<keyof T, string>}`
    | Extract<keyof T, string>;

export type SmartFieldAny = string;

interface ConditionAny {
    field: SmartFieldAny;
    operator: Operator;
    value: ValueTypes | ValueTypes[];
    unaccent?: boolean;
}

interface ClauseAny {
    junction: "and" | "or";
    conditions: (ConditionAny | ClauseAny)[];
}

interface ConditionSingle<T, TableName extends string> {
    field: SmartFieldSingle<T, TableName>;
    operator: Operator;
    value: ValueTypes | ValueTypes[];
    unaccent?: boolean;
}

interface ClauseSingle<T, TableName extends string> {
    junction: "and" | "or";
    conditions: (ConditionSingle<T, TableName> | ClauseSingle<T, TableName>)[];
}

interface ConditionMulti<T extends Record<string, any>> {
    field: SmartFieldMulti<T>;
    operator: Operator;
    value: ValueTypes | ValueTypes[];
    unaccent?: boolean;
}

interface ClauseMulti<T extends Record<string, any>> {
    junction: "and" | "or";
    conditions: (ConditionMulti<T> | ClauseMulti<T>)[];
}

export type Condition<T extends Record<string, any>> =
    | ConditionSingle<T, keyof T & string>
    | ConditionMulti<T>
    | ConditionAny;

export type Where<
    T = undefined,
    TableName extends string | undefined = undefined,
> = T extends MultiTable<infer M>
    ? ClauseMulti<M>
    : T extends Record<string, any>
      ? ClauseSingle<T, TableName extends string ? TableName : never>
      : ClauseAny;

export type MultiTable<T extends Record<string, any>> = {
    __multi: true;
    __tables: T;
};
