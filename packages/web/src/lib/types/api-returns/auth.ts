import type { authRequests } from "../../services/api-requests/auth";

export type AuthUser = Awaited<ReturnType<typeof authRequests.refresh>>["user"];
