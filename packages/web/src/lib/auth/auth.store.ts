// auth.store.ts
import { writable } from "svelte/store";
import type { AuthUser } from "$lib/types/api-returns/auth";

interface AuthState {
    accessToken: string | null;
    user: AuthUser | null;
    isAuthenticated: boolean;
}

const initial: AuthState = {
    accessToken: null,
    user: null,
    isAuthenticated: false,
};

function getInitialState(): AuthState {
    if (typeof window === "undefined") return initial;

    try {
        const raw = localStorage.getItem("auth");
        if (!raw) return initial;
        const parsed = JSON.parse(raw) as AuthState;

        if (parsed.accessToken && parsed.user) {
            return { ...parsed, isAuthenticated: true };
        }

        return initial;
    } catch {
        return initial;
    }
}

function createAuthStore() {
    const { subscribe, set } = writable<AuthState>(getInitialState());

    return {
        subscribe,

        setCredentials({
            accessToken,
            user,
        }: {
            accessToken: string;
            user: AuthUser;
        }) {
            const newState = { accessToken, user, isAuthenticated: true };
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
