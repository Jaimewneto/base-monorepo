import { AsyncLocalStorage } from "node:async_hooks";
import { BadRequestError } from "./error.js";

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

export const getCurrentRequestUserOrThrow = () => {
    const currentContext = requestContext.getStore();

    if (!currentContext?.user) {
        throw new BadRequestError({
            code: 401,
            message: "Unauthorized", // TODO: add message
            name: "UnauthorizedError",
        });
    }

    return currentContext?.user;
};
