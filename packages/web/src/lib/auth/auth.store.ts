// auth.store.ts
import { writable } from "svelte/store";
import type { AuthUser } from "$lib/types/api-returns/auth";

export interface Credentials {
    accessToken: string;
    refreshToken: string;
}

interface AuthState {
    credentials: Credentials | null;
    user: AuthUser | null;
    isAuthenticated: boolean;
}

const initial: AuthState = {
    credentials: null,
    user: null,
    isAuthenticated: false,
};

function getInitialState(): AuthState {
    if (typeof window === "undefined") return initial;

    try {
        const raw = localStorage.getItem("auth");
        if (!raw) return initial;
        const parsed = JSON.parse(raw) as AuthState;

        // Só considera autenticado se tiver credentials e user
        if (parsed.credentials && parsed.user) {
            return { ...parsed, isAuthenticated: true };
        }

        return initial;
    } catch {
        return initial;
    }
}

function createAuthStore() {
    const { subscribe, set, update } = writable<AuthState>(getInitialState());

    return {
        subscribe,

        setCredentials({
            credentials,
            user,
        }: {
            credentials: Credentials;
            user: AuthUser;
        }) {
            const newState = { credentials, user, isAuthenticated: true };
            localStorage.setItem("auth", JSON.stringify(newState));
            set(newState);
        },

        logout() {
            localStorage.removeItem("auth");
            set(initial);
        },

        hydrate() {
            const state = getInitialState();
            set(state);
        },
    };
}

export const authStore = createAuthStore();
