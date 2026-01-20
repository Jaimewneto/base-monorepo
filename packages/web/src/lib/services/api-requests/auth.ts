import { api, authApi } from "../api.client";

export const authRequests = {
    login: async ({ email, password }: { email: string; password: string }) => {
        const req = await api.public.auth.login.$post({
            json: { email, password },
        });

        if (!req) throw new Error("Request failed");

        const res = await req.json();

        if (!res.success) throw new Error("Request failed");

        return res.data;
    },
    me: async (accessToken: string) => {
        const req = await authApi.public.auth.me.$post({
            json: {
                accessToken,
            },
        });

        if (!req) throw new Error("Request failed");

        const res = await req.json();

        if (!res.success) throw new Error("Request failed");

        return res.data;
    },
    refresh: async (refreshToken: string) => {
        const req = await api.public.auth.refresh.$post({
            json: { refreshToken },
        });

        if (!req) throw new Error("Request failed");

        const res = await req.json();

        if (!res.success) throw new Error("Request failed");

        return res.data;
    },
};
