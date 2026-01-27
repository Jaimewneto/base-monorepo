import { Hono } from "hono";

import { tenantController } from "../../controllers/tenant.js";

import {
    paginatedResponse,
    successResponse,
} from "../../utils/http-response.js";

import { zodValidate } from "../../utils/zodValidator.js";

import { tenantRequestsValidations } from "../../validations/http-requests/tenant.js";

const validations = tenantRequestsValidations();

export const tenantRoutes = new Hono()
    .get(
        "/:id",
        zodValidate({ target: "param", schema: validations.findOneById }),
        async (c) => {
            const { id } = c.req.valid("param");

            return c.json(
                successResponse({
                    data: await tenantController.findOneById(id),
                }),
            );
        },
    )
    .post(
        "/list",
        zodValidate({ target: "json", schema: validations.findMany }),
        async (c) => {
            const params = c.req.valid("json");

            const { list, count } = await tenantController.findMany(params);

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
    .patch(
        "/:id",
        zodValidate({ target: "param", schema: validations.findOneById }),
        zodValidate({ target: "json", schema: validations.updateById }),
        async (c) => {
            const { id } = c.req.valid("param");

            const data = c.req.valid("json");

            return c.json(
                successResponse({
                    data: await tenantController.updateById({ id, data }),
                }),
            );
        },
    );
