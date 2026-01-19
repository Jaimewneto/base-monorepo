import type {
    ExpressionBuilder,
    Insertable,
    Selectable,
    SqlBool,
    Updateable,
} from "kysely";
import { sql } from "kysely";

import { getCurrentRequestUser } from "../../request-context.js";
import { hasCompanyIdColumn } from "../../utils/repository.js";
import { client } from "../client.js";
import type { Database } from "../schema/index.js";

export const baseRepository = <K extends keyof Database>({
    db = client,
    tableName,
}: {
    db?: typeof client;
    tableName: K;
}) => {
    const findOneById = async (
        id: string,
    ): Promise<Selectable<Database[K]> | null> => {
        const user = getCurrentRequestUser();

        let query = db
            .selectFrom(tableName)
            .selectAll()
            // @ts-expect-error
            .where(`${tableName}.id`, "=", id);

        if (user && hasCompanyIdColumn(tableName))
            query = query.where(
                `${tableName}.company_id`,
                "=",
                user.company_id,
            );

        return await query.executeTakeFirst();
    };

    const findOneByCondition = async (
        where: (eb: ExpressionBuilder<Database, K>) => SqlBool,
    ): Promise<Selectable<Database[K]> | null> => {
        const user = getCurrentRequestUser();

        let query = db
            .selectFrom(tableName)
            .selectAll()
            // @ts-expect-error
            .where(where);

        if (user && hasCompanyIdColumn(tableName))
            query = query.where(
                `${tableName}.company_id`,
                "=",
                user.company_id,
            );

        return await query.executeTakeFirst();
    };

    const findMany = async ({
        page = 1,
        limit = 10,
        where,
        orderBy,
    }: {
        page: number;
        limit: number;
        where?: (eb: ExpressionBuilder<Database, K>) => SqlBool;
        orderBy?: {
            column: keyof Database[K] & string;
            direction: "asc" | "desc";
        }[];
    }): Promise<{ count: number; list: Selectable<Database[K]>[] }> => {
        const user = getCurrentRequestUser();

        const offset = (page - 1) * limit;

        let countQuery = db
            .selectFrom(tableName)
            // @ts-expect-error
            .select(sql`count(*) as count`)
            .where(`${tableName}.deleted_at`, "is", null);

        let listQuery = db
            .selectFrom(tableName)
            .selectAll()
            // @ts-expect-error
            .where(`${tableName}.deleted_at`, "is", null);

        if (where) {
            countQuery = countQuery.where(where);
            listQuery = listQuery.where(where);
        }

        if (orderBy) {
            for (const sort of orderBy) {
                listQuery = listQuery.orderBy(sort.column, sort.direction);
            }
        }

        if (user && hasCompanyIdColumn(tableName)) {
            countQuery = countQuery.where(
                `${tableName}.company_id`,
                "=",
                user.company_id,
            );
            listQuery = listQuery.where(
                `${tableName}.company_id`,
                "=",
                user.company_id,
            );
        }

        listQuery = listQuery.orderBy("id", "desc");

        const { count } = await countQuery.executeTakeFirstOrThrow();
        const list = await listQuery.limit(limit).offset(offset).execute();

        return {
            count: Number(count),
            list,
        };
    };

    const create = async (
        data: Insertable<Database[K]>,
    ): Promise<Selectable<Database[K]>> => {
        const user = getCurrentRequestUser();

        if (
            user &&
            hasCompanyIdColumn(tableName) &&
            // @ts-expect-error
            data?.company_id !== user.company_id
        ) {
            // @ts-expect-error
            data.company_id = user.company_id;
        }

        return await db
            .insertInto(tableName)
            .values(data)
            .returningAll()
            .executeTakeFirstOrThrow();
    };

    const updateById = async ({
        id,
        data,
    }: {
        id: string;
        data: Updateable<Database[K]>;
    }): Promise<Selectable<Database[K]>> => {
        const user = getCurrentRequestUser();

        if (
            user &&
            hasCompanyIdColumn(tableName) &&
            // @ts-expect-error
            data?.company_id !== user.company_id
        ) {
            // @ts-expect-error
            data.company_id = user.company_id;
        }

        let query = db
            .updateTable(tableName)
            // @ts-expect-error
            .set(data)
            .where(`${tableName}.id`, "=", id)
            .returningAll();

        if (user && hasCompanyIdColumn(tableName))
            query = query.where(
                `${tableName}.company_id`,
                "=",
                user.company_id,
            );

        return await query.executeTakeFirst();
    };

    const deleteById = async (id: string): Promise<Selectable<Database[K]>> => {
        const user = getCurrentRequestUser();

        let query = db
            .updateTable(tableName)
            // @ts-expect-error
            .set({ deleted_at: new Date() })
            .where(`${tableName}.id`, "=", id)
            .returningAll();

        if (user && hasCompanyIdColumn(tableName))
            query = query.where(
                `${tableName}.company_id`,
                "=",
                user.company_id,
            );

        return await query.executeTakeFirst();
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
