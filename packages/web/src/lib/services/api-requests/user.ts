import { getAuthenticatedApi } from "../api.client";

export const userRequests = {
    findOneById: async (id: string) => {
        const authApi = getAuthenticatedApi();

        const req = await authApi.private.user[":id"].$get({
            param: { id },
        });

        if (!req) throw new Error("Request failed");

        const res = await req.json();

        if (!res.success) throw new Error("Request failed");

        return res.data;
    },
    findMany: async ({ page, limit }: { page: number; limit: number }) => {
        const authApi = getAuthenticatedApi();

        const req = await authApi.private.user.list.$post({
            json: {
                page,
                limit,
            },
        });

        if (!req) throw new Error("Request failed");

        const res = await req.json();

        if (!res.success) throw new Error("Request failed");

        return { meta: res.meta, data: res.data };
    },
    create: async ({
        name,
        email,
        password,
    }: {
        name: string;
        email: string;
        password: string;
    }) => {
        const authApi = getAuthenticatedApi();

        const req = await authApi.private.user.$post({
            json: {
                name,
                email,
                password,
            },
        });

        if (!req) throw new Error("Request failed");

        const res = await req.json();

        if (!res.success) throw new Error("Request failed");

        return res.data;
    },
    updateOneById: async ({ id, name }: { id: string; name: string }) => {
        const authApi = getAuthenticatedApi();

        const req = await authApi.private.user[":id"].$patch({
            param: { id },
            json: {
                name,
            },
        });

        if (!req) throw new Error("Request failed");

        const res = await req.json();

        if (!res.success) throw new Error("Request failed");

        return res.data;
    },
};
