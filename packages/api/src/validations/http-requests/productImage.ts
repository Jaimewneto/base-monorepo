import z from "zod/v4";
import type {
    ProductImage,
    ProductImageCreate,
} from "../../database/schema/productImage.js";
import type { CheckSchema } from "../../types/validation.js";

type CreateOrUpdateImages = ProductImageCreate | ProductImage;

export const productImageRequestsValidations = () => {
    const insertMany = z
        .object({
            id: z.uuid().optional(),
            tenant_id: z.uuid(),
            product_id: z.uuid(),
            url: z.url(),
            main: z.boolean().default(false),
        } satisfies CheckSchema<CreateOrUpdateImages>)
        .array();

    return {
        insertMany,
    };
};
