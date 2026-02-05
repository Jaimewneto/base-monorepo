import { Hono } from "hono";

import { inventoryController } from "../../controllers/inventory.js";

import {
    paginatedResponse,
    successResponse,
} from "../../utils/http-response.js";

import { zodValidate } from "../../utils/zodValidator.js";

import { inventoryRequestsValidations } from "../../validations/http-requests/inventory.js";

const validations = inventoryRequestsValidations();

export const inventoryRoutes = new Hono()
    .get(
        "/:id",
        zodValidate({ target: "param", schema: validations.findOneById }),
        async (c) => {
            const { id } = c.req.valid("param");

            return c.json(
                successResponse({
                    data: await inventoryController.findOneById(id),
                }),
            );
        },
    )
    .post(
        "/list",
        zodValidate({ target: "json", schema: validations.findMany }),
        async (c) => {
            const params = c.req.valid("json");

            const { list, count } = await inventoryController.findMany(params);

            return c.json(
                paginatedResponse({
                    list,
                    total: count,
                    page: params.page,
                    per_page: params.limit,
                }),
            );
        },
    )
    .post(
        "/",
        zodValidate({ target: "json", schema: validations.createOrUpdate }),
        async (c) => {
            const params = c.req.valid("json");

            return c.json(
                successResponse({
                    data: await inventoryController.createOrUpdate(params),
                }),
            );
        },
    );
