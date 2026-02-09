import type { AppType } from "@base-monorepo/api";
import { hc } from "hono/client";

export type { AppType };

export const createClient = (
  baseUrl: string,
  options?: {
    headers?: Record<string, string>;
    fetch?: typeof fetch;
  },
) => {
  return hc<AppType>(baseUrl, {
    headers: options?.headers,
    fetch: (input: RequestInfo | URL, init: RequestInit | undefined) => {
      const fetchImpl = options?.fetch ?? fetch;

      return fetchImpl(input, {
        ...init,
        credentials: "include",
      });
    },
  });
};

export type AuthClientOptions = {
    getAccessToken: () => string | null;

    fetch?: typeof fetch;
};

export const createAuthenticatedClient = (
  baseUrl: string,
  options: AuthClientOptions,
) => {
  return hc<AppType>(baseUrl, {
    fetch: async (input: RequestInfo | URL, init: RequestInit | undefined) => {
      const token = options.getAccessToken();

      const headers = {
        ...(init?.headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const fetchImpl = options.fetch ?? fetch;

      return fetchImpl(input, {
        ...init,
        headers,
        credentials: "include", // 👈 SEM ISSO, COOKIE NÃO EXISTE
      });
    },
  });
};

