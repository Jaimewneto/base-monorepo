import type { ProductImageInsertMany } from "$lib/types/productImage";

import { authApi } from "../api.client";

export const productImageRequests = {
    insertMany: async (data: ProductImageInsertMany) => {
        const req = await authApi.private.product.image.$post({
            json: data,
        });

        if (!req) throw new Error("Request failed");

        const res = await req.json();

        if (!res.success)
            throw new Error(res?.error?.message || "Request failed");

        return res.data;
    },
};
