import { userRequests } from "../../services/api-requests/user";

export type User = Awaited<ReturnType<typeof userRequests.findOneById>>;
