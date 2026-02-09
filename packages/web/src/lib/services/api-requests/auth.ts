import { api, authApi } from "../api.client";

export const authRequests = {
    login: async ({ email, password }: { email: string; password: string }) => {
        const req = await api.public.auth.login.$post({
            json: { email, password },
        });

        if (!req) throw new Error("Request failed");

        const res = await req.json();

        if (!res.success)
            throw new Error(res?.error?.message || "Request failed");

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

        if (!res.success)
            throw new Error(res?.error?.message || "Request failed");

        return res.data;
    },
    refresh: async (refreshToken: string) => {
        const req = await api.public.auth.refresh.$post({
            json: { refreshToken },
        });

        if (!req) throw new Error("Request failed");

        const res = await req.json();

        if (!res.success)
            throw new Error(res?.error?.message || "Request failed");

        return res.data;
    },
    sendPasswordResetLink: async (email: string) => {
        const req = await api.public.auth["password-reset-link"].$post({
            json: { email },
        });
    },
    resetPassword: async ({ passwordResetToken, password }: { passwordResetToken: string; password: string }) => {
        const req = await api.public.auth["reset-password"].$post({
            json: { passwordResetToken, password },
        });

        if (!req) throw new Error("Request failed");

        const res = await req.json();

        if (!res.success)
            throw new Error(res?.error?.message || "Request failed");

        return res.data;
    },
};
