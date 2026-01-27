import type {
    ExpressionBuilder,
    Insertable,
    SqlBool,
    Updateable,
} from "kysely";

import type { Database } from "../database/schema/index.js";

import { BadRequestError } from "../error.js";
import type { BaseController } from "../types/controller.js";
import type { OrderBy } from "../types/http-query/orderBy.js";
import type { Where } from "../types/http-query/where.js";
import type { ZodSortMap, ZodWhereMap } from "../types/http-query/zod.js";
import type { BaseService } from "../types/service.js";
import { buildOrderBy, buildWhereExpression } from "../utils/http-query.js";
import { getErrorMessage } from "../utils/messageTranslator.js";

export const baseController = <K extends keyof Database>(
    service: BaseService<K>,
): BaseController<K> => {
    const findOneById = async (id: string) => {
        const data = await service.findOneById(id);

        if (!data) {
            throw new BadRequestError({
                message: getErrorMessage({ key: "notFound" }),
                code: 404,
            });
        }

        return data;
    };

    const findOneByCondition = async (
        where: (eb: ExpressionBuilder<Database, K>) => SqlBool,
    ) => {
        const data = await service.findOneByCondition(where);

        if (!data) {
            throw new BadRequestError({
                message: getErrorMessage({ key: "notFound" }),
                code: 404,
            });
        }

        return data;
    };

    const findMany = async ({
        limit,
        page,
        where,
        sort,
    }: {
        limit: number;
        page: number;
        where?: ZodWhereMap[K];
        sort?: ZodSortMap[K];
    }) => {
        const finalWhere = buildWhereExpression<K>(
            where as Where<Database[K], K>,
        );
        const orderBy = buildOrderBy<K>(sort as OrderBy<Database[K], K>[]);

        return await service.findMany({
            limit,
            page,
            where: finalWhere
                ? (eb) => finalWhere(eb) as unknown as SqlBool
                : undefined,
            orderBy,
        });
    };

    const create = async (data: Insertable<Database[K]>) => {
        return await service.create(data);
    };

    const updateById = async (params: {
        id: string;
        data: Updateable<Database[K]>;
    }) => {
        return await service.updateById(params);
    };

    const deleteById = async (id: string) => {
        return await service.deleteById(id);
    };

    return {
        findOneById,
        findOneByCondition,
        findMany,
        create,
        updateById,
        deleteById,
    };
};
