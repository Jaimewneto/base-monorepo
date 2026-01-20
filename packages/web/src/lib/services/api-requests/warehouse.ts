import type { WarehouseFindManySortArgs, WarehouseFindManyWhereArgs } from "$lib/types/findManyArgs";
import { getAuthenticatedApi } from "../api.client";

export const warehouseRequests = {
    findOneById: async (id: string) => {
        const authApi = getAuthenticatedApi();

        const req = await authApi.private.warehouse[":id"].$get({
            param: { id },
        });

        if (!req) throw new Error("Request failed");

        const res = await req.json();

        if (!res.success) throw new Error("Request failed");

        return res.data;
    },
    findMany: async ({
        page,
        limit,
        where = { conditions: [] },
        sort,
    }: {
        page: number;
        limit: number;
        where: WarehouseFindManyWhereArgs;
        sort: WarehouseFindManySortArgs;
    }) => {
        const authApi = getAuthenticatedApi();

        const req = await authApi.private.warehouse.list.$post({
            json: {
                page,
                limit,
                where,
                sort,
            },
        });

        if (!req) throw new Error("Request failed");

        const res = await req.json();

        if (!res.success) throw new Error("Request failed");

        return { meta: res.meta, data: res.data };
    },
    create: async ({
        description,
        observations,
    }: {
        description: string;
        observations?: string | null;
    }) => {
        const authApi = getAuthenticatedApi();

        const req = await authApi.private.warehouse.$post({
            json: {
                description,
                observations,
            },
        });

        if (!req) throw new Error("Request failed");

        const res = await req.json();

        if (!res.success) throw new Error("Request failed");

        return res.data;
    },
    updateOneById: async ({
        id,
        description,
        observations,
    }: {
        id: string;
        description: string;
        observations?: string | null;
    }) => {
        const authApi = getAuthenticatedApi();

        const req = await authApi.private.warehouse[":id"].$patch({
            param: { id },
            json: {
                description,
                observations,
            },
        });

        if (!req) throw new Error("Request failed");

        const res = await req.json();

        if (!res.success) throw new Error("Request failed");

        return res.data;
    },
    deleteOneById: async (id: string) => {
        const authApi = getAuthenticatedApi();

        const req = await authApi.private.warehouse[":id"].$delete({
            param: { id },
        });

        if (!req) throw new Error("Request failed");

        const res = await req.json();

        if (!res.success) throw new Error("Request failed");

        return res.data;
    },
};
