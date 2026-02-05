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
    sku: string;
    description: string;
    mpn: string | null; // manufacturer part number
    gtin: string | null; // global trade item number
    ncm: string | null; // Nomenclatura Comum do Mercosul (Mercosul Trade Code)
    default_price: number;
    unit_of_measure: string; // UN, KG, LT, CX, MT
    observations: string | null;

    created_at: ColumnType<Date, string | undefined, never>;
    updated_at: ColumnType<Date, string | undefined, undefined | Date>;
    deleted_at: ColumnType<Date, string | undefined, Date>;
}

export type Product = Selectable<ProductTable>;
export type ProductCreate = Insertable<ProductTable>;
export type ProductUpdate = Updateable<ProductTable>;

export type ProductCreateWithoutTenantId = Omit<ProductCreate, "tenant_id">;
