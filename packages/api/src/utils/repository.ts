import type { Database } from "../database/schema/index.js";

export const hasTenantIdColumn = <T extends keyof Database>(
    _table: T,
): boolean => {
    // Checks if the table has the tenant_id column
    return "tenant_id" in ({} as Database[T]);
};
