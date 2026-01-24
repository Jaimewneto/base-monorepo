import type {
    //
    ColumnType,
    Generated,
    Insertable,
    Selectable,
    Updateable,
} from "kysely";

export interface ProductImageTable {
    id: Generated<string>;
    company_id: string;
    product_id: string;
    url: string;
    main: boolean;
    created_at: ColumnType<Date, string | undefined, never>;
    updated_at: ColumnType<Date, string | undefined, undefined | Date>;
    deleted_at: ColumnType<Date, string | undefined, Date>;
}

export type ProductImage = Selectable<ProductImageTable>;
export type ProductImageCreate = Insertable<ProductImageTable>;
export type ProductImageUpdate = Updateable<ProductImageTable>;
