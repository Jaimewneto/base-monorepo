import { Hono } from "hono";

import { productController } from "../../controllers/product.js";
import {
    paginatedResponse,
    successResponse,
} from "../../utils/http-response.js";
import { zodValidate } from "../../utils/zodValidator.js";
import { productRequestsValidations } from "../../validations/http-requests/product.js";
import { productImageRoutes } from "./productImage.js";

const validations = productRequestsValidations();

export const productRoutes = new Hono()
    .route("/image", productImageRoutes)
    .get(
        "/:id",
        zodValidate({ target: "param", schema: validations.findOneById }),
        async (c) => {
            const { id } = c.req.valid("param");

            return c.json(
                successResponse({
                    data: await productController.findOneById(id),
                }),
            );
        },
    )
    .post(
        "/list",
        zodValidate({ target: "json", schema: validations.findMany }),
        async (c) => {
            const { limit, page, where, sort } = c.req.valid("json");

            const { list, count } =
                await productController.findManyWithInventoriesAndImage({
                    limit,
                    page,
                    where,
                    sort,
                });

            return c.json(
                paginatedResponse({
                    list,
                    total: count,
                    page,
                    per_page: limit,
                }),
            );
        },
    )
    .post(
        "/",
        zodValidate({ target: "json", schema: validations.create }),
        async (c) => {
            const data = c.req.valid("json");

            const { tenant_id } = c.get("user");

            const scopedData = {
                ...data,
                tenant_id,
            };

            return c.json(
                successResponse({
                    data: await productController.create(scopedData),
                    status: 201,
                }),
            );
        },
    )
    .patch(
        "/:id",
        zodValidate({ target: "param", schema: validations.findOneById }),
        zodValidate({ target: "json", schema: validations.updateById }),
        async (c) => {
            const { id } = c.req.valid("param");

            const data = c.req.valid("json");

            return c.json(
                successResponse({
                    data: await productController.updateById({ id, data }),
                }),
            );
        },
    )
    .delete(
        "/:id",
        zodValidate({ target: "param", schema: validations.deleteById }),
        async (c) => {
            const { id } = c.req.valid("param");

            return c.json(
                successResponse({
                    data: await productController.deleteById(id),
                }),
            );
        },
    )
    .get(
        "/get-description-by-mpn/:mpn",
        zodValidate({ target: "param", schema: validations.findDescriptionByMpn }),
        async (c) => {
            const { mpn } = c.req.valid("param");

            const data = await productController.findDescriptionByMpn(mpn);

            return c.json(
                successResponse({
                    data,
                }),
            );
        },
    );
