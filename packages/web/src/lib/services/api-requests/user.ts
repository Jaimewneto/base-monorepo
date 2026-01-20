import type {
    UserFindManySortArgs,
    UserFindManyWhereArgs,
} from "$lib/types/findManyArgs";
import { authApi } from "../api.client";

export const userRequests = {
    findOneById: async (id: string) => {
        const req = await authApi.private.user[":id"].$get({
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
        where: UserFindManyWhereArgs;
        sort: UserFindManySortArgs;
    }) => {
        const req = await authApi.private.user.list.$post({
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
        name,
        email,
        password,
    }: {
        name: string;
        email: string;
        password: string;
    }) => {
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
