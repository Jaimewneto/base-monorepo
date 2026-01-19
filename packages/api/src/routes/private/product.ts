import { Hono } from "hono";

import { productController } from "../../controllers/product.js";
import {
    paginatedResponse,
    successResponse,
} from "../../utils/http-response.js";
import { zodValidate } from "../../utils/zodValidator.js";
import { productRequestsValidations } from "../../validations/http-requests/product.js";

const validations = productRequestsValidations();

export const productRoutes = new Hono()
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

            const { list, count } = await productController.findMany({
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

            const { company_id } = c.get("user");

            const scopedData = {
                ...data,
                company_id,
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
        zodValidate({ target: "json", schema: validations.deleteById }),
        async (c) => {
            const { id } = c.req.valid("param");

            return c.json(
                successResponse({
                    data: await productController.deleteById(id),
                }),
            );
        },
    );
