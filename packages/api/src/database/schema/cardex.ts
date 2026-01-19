import type {
    //
    ColumnType,
    Generated,
    Insertable,
    Selectable,
    Updateable,
} from "kysely";

export interface CardexTable {
    id: Generated<string>;
    company_id: string;
    product_id: string;
    warehouse_id: string;
    entry: number;
    exit: number;
    description: string;
    created_at: ColumnType<Date, string | undefined, never>;
    updated_at: ColumnType<Date, string | undefined, undefined | Date>;
    deleted_at: ColumnType<Date, string | undefined, Date>;
}

export type Cardex = Selectable<CardexTable>;
export type CardexCreate = Insertable<CardexTable>;
export type CardexUpdate = Updateable<CardexTable>;

export type CardexCreateWithoutCompanyId = Omit<CardexCreate, "company_id">;
