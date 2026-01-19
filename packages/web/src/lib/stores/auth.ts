import { writable } from "svelte/store";

import type { ApiCredentials } from "$lib/types/auth";
import type { User } from "$lib/types/user";

type AuthState = {
    user: User | null;
    credentials: ApiCredentials | null;
};

const initialState: AuthState = {
    user: null,
    credentials: null,
};

function getInitialState(): AuthState {
    if (typeof window === "undefined") return initialState;

    const rawCredentials = localStorage.getItem("credentials");
    const rawUser = localStorage.getItem("user");

    if (
        rawCredentials &&
        rawUser &&
        rawCredentials !== "undefined" &&
        rawUser !== "undefined"
    ) {
        try {
            return {
                credentials: JSON.parse(rawCredentials),
                user: JSON.parse(rawUser),
            };
        } catch {
            return initialState;
        }
    }

    return initialState;
}

function createAuthStore() {
    const { subscribe, set, update } = writable<AuthState>(getInitialState());

    return {
        subscribe,

        setAuth({
            user,
            credentials,
        }: {
            user: User;
            credentials: ApiCredentials;
        }) {
            localStorage.setItem("credentials", JSON.stringify(credentials));
            localStorage.setItem("user", JSON.stringify(user));

            set({ user, credentials });
        },

        clear() {
            localStorage.removeItem("credentials");
            localStorage.removeItem("user");

            set(initialState);
        },

        hydrateFromStorage() {
            const rawCredentials = localStorage.getItem("credentials");
            const rawUser = localStorage.getItem("user");

            if (!rawCredentials || rawCredentials === "undefined") {
                localStorage.removeItem("credentials");
                localStorage.removeItem("user");
                return;
            }
            if (!rawUser || rawUser === "undefined") {
                localStorage.removeItem("credentials");
                localStorage.removeItem("user");
                return;
            }

            try {
                const credentials = JSON.parse(
                    rawCredentials,
                ) as ApiCredentials;
                const user = JSON.parse(rawUser) as User;
                update((s) => ({ ...s, credentials, user }));
            } catch {
                localStorage.removeItem("credentials");
            }
        },
    };
}

export const authStore = createAuthStore();
