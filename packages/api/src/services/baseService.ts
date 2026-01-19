import type {
    ExpressionBuilder,
    Insertable,
    SqlBool,
    Updateable,
} from "kysely";
import type { Database } from "../database/schema/index.js";

export const baseService = <K extends keyof Database>(
    repository: ReturnType<
        typeof import("../database/repositories/baseRepository.js").baseRepository<K>
    >,
) => {
    const findOneById = async (id: string) => {
        return await repository.findOneById(id);
    };

    const findOneByCondition = async (
        where: (eb: ExpressionBuilder<Database, K>) => SqlBool,
    ) => {
        return await repository.findOneByCondition(where);
    };

    const findMany = async ({
        limit,
        page,
        where,
        orderBy,
    }: {
        limit: number;
        page: number;
        where?: (eb: ExpressionBuilder<Database, K>) => SqlBool;
        orderBy?: {
            column: keyof Database[K] & string;
            direction: "asc" | "desc";
        }[];
    }) => {
        return await repository.findMany({ limit, page, where, orderBy });
    };

    const create = async (data: Insertable<Database[K]>) => {
        return await repository.create(data);
    };

    const updateById = async (params: {
        id: string;
        data: Updateable<Database[K]>;
    }) => {
        return await repository.updateById(params);
    };

    const deleteById = async (id: string) => {
        return await repository.deleteById(id);
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
