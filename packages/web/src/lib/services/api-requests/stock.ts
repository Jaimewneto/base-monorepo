import { authApi } from "../api.client";

export const stockRequests = {
    create: async ({
        warehouse_id,
        product_id,
        amount,
    }: {
        warehouse_id: string;
        product_id: string;
        amount: number;
    }) => {
        const req = await authApi.private.stock.$post({
            json: {
                warehouse_id,
                product_id,
                amount,
            },
        });

        if (!req) throw new Error("Request failed");

        const res = await req.json();

        if (!res.success)
            throw new Error(res?.error?.message || "Request failed");

        return res.data;
    },
};
