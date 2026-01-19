import { productRequests } from "../../services/api-requests/product";

export type Product = Awaited<ReturnType<typeof productRequests.findOneById>>;
