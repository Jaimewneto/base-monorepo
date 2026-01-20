import { getAuthenticatedApi } from "$lib/services/api.client";

const authApi = getAuthenticatedApi();

export type productFindManyWhereArgs = Parameters<
    typeof authApi.private.product.list.$post
>[0]["json"]["where"];

export type productFindManySortArgs = Parameters<
    typeof authApi.private.product.list.$post
>[0]["json"]["sort"];
