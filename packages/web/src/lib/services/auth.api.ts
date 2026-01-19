import { api, getAuthenticatedApi } from "./api.client";

export async function login(email: string, password: string) {
    const req = await api.public.auth.login.$post({
        json: { email, password },
    });

    if (!req) throw new Error("Request failed");

    const res = await req.json();

    if (!res.success) throw new Error("Request failed");

    return res.data;
}

export async function me(accessToken: string) {
    const authApi = getAuthenticatedApi();

    const req = await authApi.public.auth.me.$post({
        json: {
            accessToken,
        },
    });

    if (!req) throw new Error("Request failed");

    const res = await req.json();

    if (!res.success) throw new Error("Request failed");

    return res.data;
}
