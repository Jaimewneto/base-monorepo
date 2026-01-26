import type { AuditTable } from "./schema/audit.js";
import type { CardexTable } from "./schema/cardex.js";
import type { ProductTable } from "./schema/product.js";
import type { ProductImageTable } from "./schema/productImage.js";
import type { StockTable } from "./schema/stock.js";
import type { TenantTable } from "./schema/tenant.js";
import type { UserTable } from "./schema/user.js";
import type { WarehouseTable } from "./schema/warehouse.js";

type AssertAllKeysPresent<T, K extends (keyof T)[]> = Exclude<
    keyof T,
    K[number]
> extends never
    ? true
    : ["Lacking keys:", Exclude<keyof T, K[number]>];

export const auditTableKeys = [
    "id",
    "tenant_id",
    "user_id",
    "previous_value",
    "new_value",
    "created_at",
    "updated_at",
    "deleted_at",
] as const satisfies (keyof AuditTable)[];

const _checkAuditKeys: AssertAllKeysPresent<AuditTable, typeof auditTableKeys> =
    true;

export const cardexTableKeys = [
    "id",
    "tenant_id",
    "product_id",
    "warehouse_id",
    "entry",
    "exit",
    "description",
    "created_at",
    "updated_at",
    "deleted_at",
] as const satisfies (keyof CardexTable)[];

const _checkCardexKeys: AssertAllKeysPresent<
    CardexTable,
    typeof cardexTableKeys
> = true;

export const tenantTableKeys = [
    "id",
    "name",
    "created_at",
    "updated_at",
    "deleted_at",
] as const satisfies (keyof TenantTable)[];

const _checkTenantKeys: AssertAllKeysPresent<
    TenantTable,
    typeof tenantTableKeys
> = true;

export const productTableKeys = [
    "id",
    "tenant_id",
    "internal_code",
    "description",
    "sku",
    "observations",
    "created_at",
    "updated_at",
    "deleted_at",
] as const satisfies (keyof ProductTable)[];

const _checkProductKeys: AssertAllKeysPresent<
    ProductTable,
    typeof productTableKeys
> = true;

export const stockTableKeys = [
    "id",
    "tenant_id",
    "product_id",
    "warehouse_id",
    "amount",
    "created_at",
    "updated_at",
    "deleted_at",
] as const satisfies (keyof StockTable)[];

const _checkStockKeys: AssertAllKeysPresent<StockTable, typeof stockTableKeys> =
    true;

export const userTableKeys = [
    "id",
    "tenant_id",
    "name",
    "email",
    "password",
    "created_at",
    "updated_at",
    "deleted_at",
] as const satisfies (keyof UserTable)[];

const _checkUserKeys: AssertAllKeysPresent<UserTable, typeof userTableKeys> =
    true;

export const warehouseTableKeys = [
    "id",
    "tenant_id",
    "description",
    "observations",
    "created_at",
    "updated_at",
    "deleted_at",
] as const satisfies (keyof WarehouseTable)[];

const _checkWarehouseKeys: AssertAllKeysPresent<
    WarehouseTable,
    typeof warehouseTableKeys
> = true;

export const productImageTableKeys = [
    "id",
    "tenant_id",
    "product_id",
    "url",
    "main",
    "created_at",
    "updated_at",
    "deleted_at",
] as const satisfies (keyof ProductImageTable)[];

const _checkProductImageKeys: AssertAllKeysPresent<
    ProductImageTable,
    typeof productImageTableKeys
> = true;

export const database = {
    auditTable: {
        name: "audit",
        keys: auditTableKeys,
    },
    cardexTable: {
        name: "cardex",
        keys: cardexTableKeys,
    },
    tenantTable: {
        name: "tenant",
        keys: tenantTableKeys,
    },
    productTable: {
        name: "product",
        keys: productTableKeys,
    },
    stockTable: {
        name: "stock",
        keys: stockTableKeys,
    },
    userTable: {
        name: "user",
        keys: userTableKeys,
    },
    warehouseTable: {
        name: "warehouse",
        keys: warehouseTableKeys,
    },
    productImageTable: {
        name: "product_image",
        keys: productImageTableKeys,
    },
} as const;
