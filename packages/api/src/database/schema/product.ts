import type {
    //
    ColumnType,
    Generated,
    Insertable,
    Selectable,
    Updateable,
} from "kysely";

export interface ProductTable {
    id: Generated<string>;
    tenant_id: string;
    internal_code: string;
    description: string;
    sku: string;
    observations: string | null;
    created_at: ColumnType<Date, string | undefined, never>;
    updated_at: ColumnType<Date, string | undefined, undefined | Date>;
    deleted_at: ColumnType<Date, string | undefined, Date>;
}

export type Product = Selectable<ProductTable>;
export type ProductCreate = Insertable<ProductTable>;
export type ProductUpdate = Updateable<ProductTable>;

export type ProductCreateWithoutTenantId = Omit<ProductCreate, "tenant_id">;
