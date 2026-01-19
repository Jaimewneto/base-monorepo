import type { ContentfulStatusCode } from "hono/utils/http-status";

export class BadRequestError extends Error {
    public code: ContentfulStatusCode;

    constructor({
        code = 400,
        message = "Bad request",
        name = "BadRequestError",
    }: { code?: ContentfulStatusCode; message?: string; name?: string } = {}) {
        super(message);
        this.name = name;
        this.code = code;
    }
}
