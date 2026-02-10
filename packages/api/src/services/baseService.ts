import type {
    ExpressionBuilder,
    Insertable,
    SqlBool,
    Updateable,
} from "kysely";
import { client } from "../database/client.js";
import { auditRepository } from "../database/repositories/audit.js";
import type { Database } from "../database/schema/index.js";
import { getCurrentRequestUserOrThrow } from "../request-context.js";
import type { BaseRepository } from "../types/repository.js";
import type { BaseService } from "../types/service.js";

export const baseService = <K extends keyof Database>(
    repository: BaseRepository<K>,
): BaseService<K> => {
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
        const user = getCurrentRequestUserOrThrow();

        return await client.transaction().execute(async (trx) => {
            const auditRepositoryInstance = auditRepository(trx);

            const result = await repository.create({ data, client: trx });

            await auditRepositoryInstance.create({
                data: {
                    tenant_id: user.tenant_id,
                    user_id: user.id,
                    table: repository.getTableName(),
                    new_value: JSON.stringify(result),
                },
            });

            return result;
        });
    };

    const updateById = async (params: {
        id: string;
        data: Updateable<Database[K]>;
    }) => {
        const user = getCurrentRequestUserOrThrow();

        return await client.transaction().execute(async (trx) => {
            const auditRepositoryInstance = auditRepository(trx);

            const result = await repository.updateById(params);

            await auditRepositoryInstance.create({
                data: {
                    tenant_id: user.tenant_id,
                    user_id: user.id,
                    table: repository.getTableName(),
                    previous_value: JSON.stringify(
                        await repository.findOneById(params.id),
                    ),
                    new_value: JSON.stringify(result),
                },
            });

            return result;
        });
    };

    const deleteById = async (id: string) => {
        const user = getCurrentRequestUserOrThrow();

        return await client.transaction().execute(async (trx) => {
            const auditRepositoryInstance = auditRepository(trx);

            const previousValue = await repository.findOneById(id);

            await auditRepositoryInstance.create({
                data: {
                    tenant_id: user.tenant_id,
                    user_id: user.id,
                    table: repository.getTableName(),
                    previous_value: JSON.stringify(previousValue),
                    new_value: JSON.stringify({
                        ...previousValue,
                        deleted_at: new Date(),
                    }),
                },
            });

            return await repository.deleteById({ id });
        });
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
