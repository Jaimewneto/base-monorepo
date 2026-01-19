import { getAuthenticatedApi } from "../api.client";

export const productRequests = {
    findOneById: async (id: string) => {
        const authApi = getAuthenticatedApi();

        const req = await authApi.private.product[":id"].$get({
            param: { id },
        });

        if (!req) throw new Error("Request failed");

        const res = await req.json();

        if (!res.success) throw new Error("Request failed");

        return res.data;
    },
    findMany: async ({ page, limit, where = { conditions: [] }, sort }: { page: number; limit: number, where: any, sort: any[] }) => {
        const authApi = getAuthenticatedApi();

        const req = await authApi.private.product.list.$post({
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
    create: async ({ description, internal_code, sku, observations }: { description: string; internal_code: string; sku: string; observations?: string | null }) => {
        const authApi = getAuthenticatedApi();

        const req = await authApi.private.product.$post(
            {
                json: {
                    description,
                    internal_code,
                    sku,
                    observations
                },
            }
        );

        if (!req) throw new Error("Request failed");

        const res = await req.json();

        if (!res.success) throw new Error("Request failed");

        return res.data;
    },
    updateOneById: async ({ id, description, internal_code, sku, observations }: { id: string; description: string; internal_code: string; sku: string; observations?: string | null }) => {
        const authApi = getAuthenticatedApi();

        const req = await authApi.private.product[":id"].$patch({
            param: { id },
            json: {
                description,
            internal_code,
            sku,
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

        const req = await authApi.private.product[":id"].$delete({
            param: { id },
        });

        if (!req) throw new Error("Request failed");

        const res = await req.json();

        if (!res.success) throw new Error("Request failed");

        return res.data;
    },
};
