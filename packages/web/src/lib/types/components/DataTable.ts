import type { Snippet } from "svelte";

export type WhereField<T> = T extends { conditions: (infer C)[] }
    ? C extends { field: infer F }
        ? F
        : C extends { conditions: { field: infer F }[] }
          ? F
          : never
    : never;

export type SortField<T> =
    NonNullable<T> extends (infer S)[]
        ? S extends { field: infer F }
            ? F
            : never
        : never;

type BaseColumn = {
    label: string;
    operator: "ilike" | "=" | ">" | "<" | ">=" | "<=";
    valueType: "string" | "number" | "date";
};

type ActiveColumn<Field extends string, Sort extends string> = BaseColumn & {
    field: Field & Sort;
    sortable: true;
    filterable: true;
};

type FilterOnlyColumn<Where extends string> = BaseColumn & {
    field: Where;
    sortable: false;
    filterable: true;
};

type SortOnlyColumn<Sort extends string> = BaseColumn & {
    field: Sort;
    sortable: true;
    filterable: false;
};

type PassiveColumn = BaseColumn & {
    field: string;
    sortable: false;
    filterable: false;
};
export type Column<Where extends string, Sort extends string> =
    | ActiveColumn<Where, Sort>
    | FilterOnlyColumn<Where>
    | SortOnlyColumn<Sort>
    | PassiveColumn;

export type DataTableProps<
    WhereField extends string,
    SortField extends string,
    W,
    S,
> = {
    columns: Column<WhereField, SortField>[];
    data: any[];
    loading: boolean;
    onQueryChange: (params: { where: W; sort: S }) => void;
    children: Snippet;
};
