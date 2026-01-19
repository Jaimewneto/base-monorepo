import type z from "zod/v4";

export type CheckSchema<T> = {
    [K in keyof T]: z.ZodType<T[K]>;
};
