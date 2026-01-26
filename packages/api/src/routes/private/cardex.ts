import { Hono } from "hono";

import { cardexController } from "../../controllers/cardex.js";
import {
    paginatedResponse,
    successResponse,
} from "../../utils/http-response.js";
import { zodValidate } from "../../utils/zodValidator.js";
import { cardexRequestsValidations } from "../../validations/http-requests/cardex.js";

const validations = cardexRequestsValidations();

export const cardexRoutes = new Hono()
    .post(
        "/list",
        zodValidate({ target: "json", schema: validations.findMany }),
        async (c) => {
            const params = c.req.valid("json");

            const { list, count } = await cardexController.findMany(params);

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
                    data: await cardexController.create(scopedData),
                    status: 201,
                }),
            );
        },
    );
