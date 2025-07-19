import { DB, Users } from "@common/types/kysely/db.type";
import { type Insertable, type Kysely, Transaction } from "kysely";

type InsertableUserRowType = Insertable<Users>;

export async function insert(con: Kysely<DB> | Transaction<DB>, entity: InsertableUserRowType) {
    return await con.insertInto("users").returningAll().values(entity).executeTakeFirstOrThrow();
}

export async function getByEmail(con: Kysely<DB>, email: string) {
    return await con.selectFrom("users").selectAll().where("email", "=", email).executeTakeFirst();
}

export async function getByIds(con: Kysely<DB>, ids: string[]) {
    return await con.selectFrom("users").select(["id"]).where("id", "in", ids).execute();
}
