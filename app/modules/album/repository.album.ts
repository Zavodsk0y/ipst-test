import { type Insertable, type Kysely, Transaction } from "kysely";
import { Albums, DB } from "../../common/types/kysely/db.type";

type InsertableAlbumRowType = Insertable<Albums>;

export async function insert(con: Kysely<DB> | Transaction<DB>, entity: InsertableAlbumRowType) {
    return await con.insertInto("albums").returningAll().values(entity).executeTakeFirstOrThrow();
}

export async function getAllByUserId(con: Kysely<DB> | Transaction<DB>, userId: string) {
    const selectOptions = ["albums.id", "albums.name"] as const;

    return await con.selectFrom("albums").select(selectOptions).where("user_id", "=", userId).execute();
}

export async function getById(con: Kysely<DB> | Transaction<DB>, id: string) {
    return await con.selectFrom("albums").selectAll().where("id", "=", id).executeTakeFirst();
}

export async function removeById(con: Kysely<DB> | Transaction<DB>, id: string) {
    return await con.deleteFrom("albums").where("id", "=", id).execute();
}
