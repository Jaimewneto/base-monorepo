// auth.manager.ts
import { get } from "svelte/store";
import { authRequests } from "$lib/services/api-requests/auth";
import { authStore } from "./auth.store";

let refreshPromise: Promise<void> | null = null;

export const authManager = {
    async ensureValidSession() {
        if (refreshPromise) return refreshPromise;

        refreshPromise = (async () => {
            const { accessToken, user } = await authRequests.refresh();

            authStore.setCredentials({ accessToken, user });
        })();

        try {
            await refreshPromise;
        } catch {
            authStore.logout();
            // Chama logout no backend pra limpar o cookie
            await authRequests.logout();
            window.location.href = "/login";
            throw new Error("Sessão expirada");
        } finally {
            refreshPromise = null;
        }
    },
};
