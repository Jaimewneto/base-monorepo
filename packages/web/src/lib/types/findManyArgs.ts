import type { authApi } from "$lib/services/api.client";

export type ProductFindManyWhereArgs = Parameters<
    typeof authApi.private.product.list.$post
>[0]["json"]["where"];

export type ProductFindManySortArgs = Parameters<
    typeof authApi.private.product.list.$post
>[0]["json"]["sort"];

export type UserFindManyWhereArgs = Parameters<
    typeof authApi.private.user.list.$post
>[0]["json"]["where"];

export type UserFindManySortArgs = Parameters<
    typeof authApi.private.user.list.$post
>[0]["json"]["sort"];

export type WarehouseFindManyWhereArgs = Parameters<
    typeof authApi.private.warehouse.list.$post
>[0]["json"]["where"];

export type WarehouseFindManySortArgs = Parameters<
    typeof authApi.private.warehouse.list.$post
>[0]["json"]["sort"];
