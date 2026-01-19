import {
    createAuthenticatedClient,
    createClient,
} from "@base-monorepo/api-client";

import { get } from "svelte/store";

import { authStore } from "$lib/stores/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = createClient(API_URL);

export const getAuthenticatedApi = () => {
    const { credentials } = get(authStore);

    return createAuthenticatedClient(API_URL, credentials?.accessToken ?? "");
};
