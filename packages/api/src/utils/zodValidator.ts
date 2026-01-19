import { zValidator } from "@hono/zod-validator";
import type { ZodType } from "zod/v4";

type ValidationTarget =
    | "json"
    | "query"
    | "param"
    | "header"
    | "cookie"
    | "form";

export const zodValidate = <
    TTarget extends ValidationTarget,
    TSchema extends ZodType<any, any, any>,
>({
    target,
    schema,
}: {
    target: TTarget;
    schema: TSchema;
}) => {
    return zValidator(target, schema, (result, c) => {
        if (!result.success) {
            return c.json(
                {
                    success: false,
                    error: {
                        type: "validation_error",
                        target,
                        fields: result.error.issues.map((issue) => ({
                            path: issue.path.join("."),
                            message: issue.message,
                        })),
                    },
                } as const,
                400,
            );
        }
    });
};
