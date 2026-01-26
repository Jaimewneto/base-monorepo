import "hono";

declare module "hono" {
    interface ContextVariableMap {
        user: {
            id: string;
            tenant_id: string;
            name: string;
        };
    }
}
