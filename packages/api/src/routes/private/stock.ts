import { Hono } from "hono";

import { stockController } from "../../controllers/stock.js";
import {
    paginatedResponse,
    successResponse,
} from "../../utils/http-response.js";
import { zodValidate } from "../../utils/zodValidator.js";
import { stockRequestsValidations } from "../../validations/http-requests/stock.js";

const validations = stockRequestsValidations();

export const stockRoutes = new Hono()
    .get(
        "/:id",
        zodValidate({ target: "param", schema: validations.findOneById }),
        async (c) => {
            const { id } = c.req.valid("param");

            return c.json(
                successResponse({
                    data: await stockController.findOneById(id),
                }),
            );
        },
    )
    .post(
        "/list",
        zodValidate({ target: "json", schema: validations.findMany }),
        async (c) => {
            const params = c.req.valid("json");

            const { list, count } = await stockController.findMany(params);

            return c.json(
                paginatedResponse({
                    list,
                    total: count,
                    page: params.page,
                    per_page: params.limit,
                }),
            );
        },
    );
