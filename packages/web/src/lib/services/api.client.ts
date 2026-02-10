// packages/web/src/lib/services/api.client.ts
import {
    createAuthenticatedClient,
    createClient,
} from "@base-monorepo/api-client";

import { get } from "svelte/store";
import { authStore } from "$lib/auth/auth.store";
import { apiFetch } from "./api.fetch";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = createClient(API_URL);

export const authApi = createAuthenticatedClient(API_URL, {
    getAccessToken: () => get(authStore).accessToken ?? null,
    fetch: apiFetch,
});
