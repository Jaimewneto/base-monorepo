// api.fetch.ts
import { get } from "svelte/store";
import { authStore } from "$lib/auth/auth.store";
import { authManager } from "$lib/auth/auth.manager";

export async function apiFetch(input: RequestInfo | URL, init?: RequestInit) {
    const doFetch = () => {
        const { credentials } = get(authStore);

        return fetch(input, {
            ...init,
            headers: {
                ...init?.headers,
                "Content-Type": "application/json",
                Authorization: credentials?.accessToken
                    ? `Bearer ${credentials.accessToken}`
                    : "",
            },
        });
    };

    let response = await doFetch();

    let retry = false;

    if (response.status === 401 && !retry) {
        retry = true;
        await authManager.ensureValidSession();
        response = await doFetch();
    }

    return response;
}
