import { AsyncLocalStorage } from "node:async_hooks";

export type RequestContext = {
    user?: {
        id: string;
        tenant_id: string;
        name: string;
    };
};

export const requestContext = new AsyncLocalStorage<RequestContext>();

export const getCurrentRequestUser = () => {
    const currentContext = requestContext.getStore();

    return currentContext?.user;
};
