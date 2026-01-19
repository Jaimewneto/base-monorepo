import "hono";

declare module "hono" {
    interface ContextVariableMap {
        user: {
            id: string;
            company_id: string;
            name: string;
        };
    }
}
