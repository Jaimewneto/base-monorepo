import { Hono } from "hono";

import { companyController } from "../../controllers/company.js";
import {
    paginatedResponse,
    successResponse,
} from "../../utils/http-response.js";
import { zodValidate } from "../../utils/zodValidator.js";
import { companyRequestsValidations } from "../../validations/http-requests/company.js";

const validations = companyRequestsValidations();

export const companyRoutes = new Hono()
    .get(
        "/:id",
        zodValidate({ target: "param", schema: validations.findOneById }),
        async (c) => {
            const { id } = c.req.valid("param");

            return c.json(
                successResponse({
                    data: await companyController.findOneById(id),
                }),
            );
        },
    )
    .post(
        "/list",
        zodValidate({ target: "json", schema: validations.findMany }),
        async (c) => {
            const params = c.req.valid("json");

            const { list, count } = await companyController.findMany(params);

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
                    data: await companyController.updateById({ id, data }),
                }),
            );
        },
    );
