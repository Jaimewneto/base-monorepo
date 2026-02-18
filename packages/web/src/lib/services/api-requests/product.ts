import type {
    ProductFindManySortArgs,
    ProductFindManyWhereArgs,
} from "$lib/types/findManyArgs";

import { authApi } from "../api.client";

export const productRequests = {
    findOneById: async (id: string) => {
        const req = await authApi.private.product[":id"].$get({
            param: { id },
        });

        if (!req) throw new Error("Request failed");

        const res = await req.json();

        if (!res.success)
            throw new Error(res?.error?.message || "Request failed");

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
        where: ProductFindManyWhereArgs;
        sort: ProductFindManySortArgs;
    }) => {
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

        if (!res.success)
            throw new Error(res?.error?.message || "Request failed");

        return { meta: res.meta, data: res.data };
    },
    create: async ({
        sku,
        description,
        mpn,
        gtin,
        ncm,
        default_price,
        unit_of_measure,
        observations,
    }: {
        sku: string;
        description: string;
        mpn: string | null;
        gtin: string | null;
        ncm: string | null;
        default_price: number;
        unit_of_measure: string;
        observations?: string | null;
    }) => {
        const req = await authApi.private.product.$post({
            json: {
                sku,
                description,
                mpn,
                gtin,
                ncm,
                default_price,
                unit_of_measure,
                observations,
            },
        });

        if (!req) throw new Error("Request failed");

        const res = await req.json();

        if (!res.success)
            throw new Error(res?.error?.message || "Request failed");

        return res.data;
    },
    updateOneById: async ({
        id,
        sku,
        description,
        mpn,
        gtin,
        ncm,
        default_price,
        unit_of_measure,
        observations,
    }: {
        id: string;
        sku: string;
        description: string;
        mpn: string | null;
        gtin: string | null;
        ncm: string | null;
        default_price: number;
        unit_of_measure: string;
        observations?: string | null;
    }) => {
        const req = await authApi.private.product[":id"].$patch({
            param: { id },
            json: {
                sku,
                description,
                mpn,
                gtin,
                ncm,
                default_price,
                unit_of_measure,
                observations,
            },
        });

        if (!req) throw new Error("Request failed");

        const res = await req.json();

        if (!res.success)
            throw new Error(res?.error?.message || "Request failed");

        return res.data;
    },
    deleteOneById: async (id: string) => {
        const req = await authApi.private.product[":id"].$delete({
            param: { id },
        });

        if (!req) throw new Error("Request failed");

        const res = await req.json();

        if (!res.success)
            throw new Error(res?.error?.message || "Request failed");

        return res.data;
    },
    getPartDescriptionWithAi: async (mpn: string) => {
        const req = await authApi.private.product["get-description-by-mpn"][":mpn"].$get({
            param: { mpn },
        });

        if (!req) throw new Error("Request failed");

        const res = await req.json();

        if (!res.success)
            throw new Error(res?.error?.message || "Request failed");

        return res.data;
    },
};
