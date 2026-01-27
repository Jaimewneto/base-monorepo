import type { ContentfulStatusCode } from "hono/utils/http-status";
import { getErrorMessage } from "./utils/messageTranslator.js";

export class BadRequestError extends Error {
    public code: ContentfulStatusCode;

    constructor({
        code = 400,
        message = getErrorMessage({
            key: "badRequest",
        }),
        name = "BadRequestError",
    }: { code?: ContentfulStatusCode; message?: string; name?: string } = {}) {
        super(message);
        this.name = name;
        this.code = code;
    }
}
