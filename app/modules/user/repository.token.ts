import { type Insertable, type Kysely, sql, Transaction } from "kysely";
import { DB, RefreshTokens } from "../../common/types/kysely/db.type";

type InsertableRefreshTokenRowType = Insertable<RefreshTokens>;

export async function insert(con: Kysely<DB> | Transaction<DB>, entity: InsertableRefreshTokenRowType) {
    return await con.insertInto("refresh_tokens").returningAll().values(entity).executeTakeFirstOrThrow();
}

export async function getByUserId(con: Kysely<DB>, userId: string) {
    return await con.selectFrom("refresh_tokens").selectAll().where("user_id", "=", userId).executeTakeFirst();
}

export async function getByUserIdAndRefreshToken(con: Kysely<DB>, userId: string, refreshToken: string) {
    return await con.selectFrom("refresh_tokens").selectAll().where("user_id", "=", userId).where("refresh_token", "=", refreshToken).executeTakeFirst();
}

export async function updateRefreshToken(con: Kysely<DB> | Transaction<DB>, id: string, refreshToken: string) {
    return con
        .updateTable("refresh_tokens")
        .set({ refresh_token: refreshToken, expires_at: sql`now() + INTERVAL '7 days'` })
        .where("id", "=", id)
        .execute();
}
