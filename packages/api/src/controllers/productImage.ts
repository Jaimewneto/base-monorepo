import type {
    ProductImage,
    ProductImageCreate,
} from "../database/schema/productImage.js";
import { productImageService } from "../services/productImage.js";
import { baseController } from "./baseController.js";

type CreateOrUpdateImages = ProductImageCreate[] | ProductImage[];

export const base = baseController<"product_image">(productImageService);

export const productImageController = {
    ...base,

    insertMany: async (data: CreateOrUpdateImages) => {
        return await productImageService.insertMany(data);
    },
};
