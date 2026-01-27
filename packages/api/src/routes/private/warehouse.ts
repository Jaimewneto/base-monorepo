import { Hono } from "hono";

import { warehouseController } from "../../controllers/warehouse.js";

import {
    paginatedResponse,
    successResponse,
} from "../../utils/http-response.js";

import { zodValidate } from "../../utils/zodValidator.js";

import { warehouseRequestsValidations } from "../../validations/http-requests/warehouse.js";

const validations = warehouseRequestsValidations();

export const warehouseRoutes = new Hono()
    .get(
        "/:id",
        zodValidate({ target: "param", schema: validations.findOneById }),
        async (c) => {
            const { id } = c.req.valid("param");

            return c.json(
                successResponse({
                    data: await warehouseController.findOneById(id),
                }),
            );
        },
    )
    .post(
        "/list",
        zodValidate({ target: "json", schema: validations.findMany }),
        async (c) => {
            const params = c.req.valid("json");

            const { list, count } = await warehouseController.findMany(params);

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
                    data: await warehouseController.create(scopedData),
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
                    data: await warehouseController.updateById({ id, data }),
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
                    data: await warehouseController.deleteById(id),
                }),
            );
        },
    );
