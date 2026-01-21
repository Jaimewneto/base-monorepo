// auth.manager.ts
import { get } from "svelte/store";
import { authRequests } from "$lib/services/api-requests/auth";
import { authStore } from "./auth.store";

let refreshPromise: Promise<void> | null = null;

export const authManager = {
    async ensureValidSession() {
        if (refreshPromise) return refreshPromise;

        refreshPromise = (async () => {
            const { credentials } = get(authStore);

            if (!credentials?.refreshToken) throw new Error("No refresh token");

            const { credentials: tokens, user } = await authRequests.refresh(
                credentials.refreshToken,
            );

            authStore.setCredentials({ credentials: tokens, user });
        })();

        try {
            await refreshPromise;
        } catch {
            authStore.logout();
            window.location.href = "/login";
            throw new Error("Session expired");
        } finally {
            refreshPromise = null;
        }
    },
};
