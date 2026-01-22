import type { warehouseRequests } from "../../services/api-requests/warehouse";

export type Warehouse = Awaited<
    ReturnType<typeof warehouseRequests.findOneById>
>;
