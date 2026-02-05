import type { productRequests } from "../../services/api-requests/product";

export type Product = Awaited<ReturnType<typeof productRequests.findOneById>>;

export type ProductWithInventories = Awaited<
    ReturnType<typeof productRequests.findMany>
>["data"][0];
