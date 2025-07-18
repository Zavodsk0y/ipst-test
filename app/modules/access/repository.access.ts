import { DB, GrantedAccesses } from "@common/types/kysely/db.type";
import { Insertable, Kysely, Transaction } from "kysely";

type InsertableAccessRowType = Insertable<GrantedAccesses>;

export async function insertMany(con: Kysely<DB>, entities: InsertableAccessRowType[]) {
    return await con.insertInto("granted_accesses").values(entities).execute();
}

export async function getByUsersAndAlbumId(con: Kysely<DB> | Transaction<DB>, usersIds: string[], albumId: string) {
    return await con.selectFrom("granted_accesses").selectAll().where("user_id", "in", usersIds).where("album_id", "=", albumId).execute();
}

export async function getByUserId(con: Kysely<DB> | Transaction<DB>, userId: string) {
    return await con.selectFrom("granted_accesses").select(["id"]).where("user_id", "=", userId).executeTakeFirst();
}

export async function getGrantedUsersByAlbumId(con: Kysely<DB> | Transaction<DB>, albumId: string) {
    const selectOptions = ["users.id", "users.email"] as const;

    return await con
        .selectFrom("granted_accesses")
        .innerJoin("users", "users.id", "granted_accesses.user_id")
        .select(selectOptions)
        .where("granted_accesses.album_id", "=", albumId)
        .execute();
}

export async function getAccessibleAlbumsByUserId(con: Kysely<DB> | Transaction<DB>, userId: string) {
    const selectOptions = ["albums.id", "albums.name"] as const;

    return await con
        .selectFrom("granted_accesses")
        .innerJoin("albums", "albums.id", "granted_accesses.album_id")
        .select(selectOptions)
        .where("granted_accesses.user_id", "=", userId)
        .execute();
}
