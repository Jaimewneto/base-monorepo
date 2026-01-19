import type { Database } from "../database/schema/index.js";

export const hasCompanyIdColumn = <T extends keyof Database>(
    _table: T,
): boolean => {
    // Checks if the table has the company_id column
    return "company_id" in ({} as Database[T]);
};
