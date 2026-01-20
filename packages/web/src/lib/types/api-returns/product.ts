import { productRequests } from "../../services/api-requests/product";

export type Product = Awaited<ReturnType<typeof productRequests.findOneById>>;

export type ProductWithStocks = Awaited<
    ReturnType<typeof productRequests.findMany>
>["data"][0];
