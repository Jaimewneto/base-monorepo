import { Hono } from "hono";

import { userController } from "../../controllers/user.js";

import {
    paginatedResponse,
    successResponse,
} from "../../utils/http-response.js";

import { zodValidate } from "../../utils/zodValidator.js";

import { userRequestsValidations } from "../../validations/http-requests/user.js";

const validations = userRequestsValidations();

export const userRoutes = new Hono()
    .get(
        "/:id",
        zodValidate({ target: "param", schema: validations.findOneById }),
        async (c) => {
            const { id } = c.req.valid("param");

            return c.json(
                successResponse({
                    data: await userController.findOneById(id),
                }),
            );
        },
    )
    .post(
        "/list",
        zodValidate({ target: "json", schema: validations.findMany }),
        async (c) => {
            const params = c.req.valid("json");

            const { list, count } = await userController.findMany(params);

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
                    data: await userController.create(scopedData),
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
                    data: await userController.updateById({ id, data }),
                }),
            );
        },
    );
