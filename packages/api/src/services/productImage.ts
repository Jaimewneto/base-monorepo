import type { Insertable, SqlBool } from "kysely";
import { client } from "../database/client.js";

import { productImageRepository } from "../database/repositories/productImage.js";
import type {
    ProductImage,
    ProductImageCreate,
} from "../database/schema/productImage.js";
import { BadRequestError } from "../error.js";
import { baseService } from "./baseService.js";

const base = baseService<"product_image">(productImageRepository(client));

type CreateOrUpdateImages = ProductImageCreate[] | ProductImage[];

export const productImageService = {
    ...base,

    insertMany: async (data: CreateOrUpdateImages) => {
        if (data.length > 10) {
            throw new BadRequestError({
                message:
                    "Não é possível adicionar mais de 10 imagens por produto",
            });
        }

        const mainImages = data.filter((img) => "main" in img && img.main);

        if (mainImages.length > 1) {
            throw new BadRequestError({
                message: "Somente uma imagem principal por produto",
            });
        }

        await client.transaction().execute(async (trx) => {
            const repo = productImageRepository(trx);

            const { list: existingImages } = await repo.findMany({
                limit: 10,
                page: 1,
                where: (eb) =>
                    eb.and([
                        eb("product_image.product_id", "=", data[0].product_id),
                        eb("product_image.deleted_at", "is", null),
                    ]) as unknown as SqlBool,
            });

            // Verificamos se alguma das "existingImages" não veio na array pra excluí-la

            for (const item of existingImages) {
                const exists = data.find((img) => img.id === item.id);

                if (!exists) {
                    await repo.deleteById(item.id);
                }
            }

            for (const item of data) {
                if ("id" in item) {
                    const exists = existingImages.find(
                        (img) => img.id === item.id,
                    );

                    if (exists) {
                        repo.updateById({
                            id: (item as ProductImage).id,
                            data: {
                                main: item.main,
                            },
                        });
                    }

                    continue;
                }

                await repo.create(item as ProductImageCreate);
            }
        });

        return true;
    },
};
