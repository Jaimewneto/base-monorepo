import type { AppType } from "@base-monorepo/api";

import { hc } from "hono/client";

export type { AppType };

export const createClient = (
    baseUrl: string,
    options?: {
        headers?: Record<string, string>;
    },
) => {
    return hc<AppType>(baseUrl, {
        headers: options?.headers,
    });
};

export const createAuthenticatedClient = (baseUrl: string, token: string) => {
    return createClient(baseUrl, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
