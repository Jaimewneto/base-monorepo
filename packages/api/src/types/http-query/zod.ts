import type { z } from "zod/v4";

import { database } from "../../database/constSchema.js";

import { queryRequestsValidations } from "../../validations/http-requests/query.js";

// Audit
const auditWhereSortSchema = queryRequestsValidations({
    tableName: database.auditTable.name,
    tableKeys: database.auditTable.keys,
}).WhereSortSchema;

export type AuditWhereSortZodValidation = z.infer<typeof auditWhereSortSchema>;
export type AuditWhereZodValidation = AuditWhereSortZodValidation["where"];
export type AuditSortZodValidation = AuditWhereSortZodValidation["sort"];

// Cardex
const cardexWhereSortSchema = queryRequestsValidations({
    tableName: database.cardexTable.name,
    tableKeys: database.cardexTable.keys,
}).WhereSortSchema;

export type CardexWhereSortZodValidation = z.infer<
    typeof cardexWhereSortSchema
>;
export type CardexWhereZodValidation = CardexWhereSortZodValidation["where"];
export type CardexSortZodValidation = CardexWhereSortZodValidation["sort"];

// Tenant
const tenantWhereSortSchema = queryRequestsValidations({
    tableName: database.tenantTable.name,
    tableKeys: database.tenantTable.keys,
}).WhereSortSchema;

export type TenantWhereSortZodValidation = z.infer<
    typeof tenantWhereSortSchema
>;
export type TenantWhereZodValidation = TenantWhereSortZodValidation["where"];
export type TenantSortZodValidation = TenantWhereSortZodValidation["sort"];

// Product
const productWhereSortSchema = queryRequestsValidations({
    tableName: database.productTable.name,
    tableKeys: database.productTable.keys,
}).WhereSortSchema;

export type ProductWhereSortZodValidation = z.infer<
    typeof productWhereSortSchema
>;
export type ProductWhereZodValidation = ProductWhereSortZodValidation["where"];
export type ProductSortZodValidation = ProductWhereSortZodValidation["sort"];

// Product image
const productImageWhereSortSchema = queryRequestsValidations({
    tableName: database.productImageTable.name,
    tableKeys: database.productImageTable.keys,
}).WhereSortSchema;

export type ProductImageWhereSortZodValidation = z.infer<
    typeof productImageWhereSortSchema
>;
export type ProductImageWhereZodValidation =
    ProductImageWhereSortZodValidation["where"];
export type ProductImageSortZodValidation =
    ProductImageWhereSortZodValidation["sort"];

// Stock
const stockWhereSortSchema = queryRequestsValidations({
    tableName: database.stockTable.name,
    tableKeys: database.stockTable.keys,
}).WhereSortSchema;

export type StockWhereSortZodValidation = z.infer<typeof stockWhereSortSchema>;
export type StockWhereZodValidation = StockWhereSortZodValidation["where"];
export type StockSortZodValidation = StockWhereSortZodValidation["sort"];

// User
const userWhereSortSchema = queryRequestsValidations({
    tableName: database.userTable.name,
    tableKeys: database.userTable.keys,
}).WhereSortSchema;

export type UserWhereSortZodValidation = z.infer<typeof userWhereSortSchema>;
export type UserWhereZodValidation = UserWhereSortZodValidation["where"];
export type UserSortZodValidation = UserWhereSortZodValidation["sort"];

// Warehouse
const warehouseWhereSortSchema = queryRequestsValidations({
    tableName: database.warehouseTable.name,
    tableKeys: database.warehouseTable.keys,
}).WhereSortSchema;

export type WarehouseWhereSortZodValidation = z.infer<
    typeof warehouseWhereSortSchema
>;
export type WarehouseWhereZodValidation =
    WarehouseWhereSortZodValidation["where"];
export type WarehouseSortZodValidation =
    WarehouseWhereSortZodValidation["sort"];

export type ZodWhereMap = {
    audit: AuditWhereZodValidation;
    cardex: CardexWhereZodValidation;
    product: ProductWhereZodValidation;
    product_image: ProductImageWhereZodValidation;
    stock: StockWhereZodValidation;
    tenant: TenantWhereZodValidation;
    user: UserWhereZodValidation;
    warehouse: WarehouseWhereZodValidation;
};

export type ZodSortMap = {
    audit: AuditSortZodValidation;
    cardex: CardexSortZodValidation;
    product: ProductSortZodValidation;
    product_image: ProductImageSortZodValidation;
    stock: StockSortZodValidation;
    tenant: TenantSortZodValidation;
    user: UserSortZodValidation;
    warehouse: WarehouseSortZodValidation;
};
