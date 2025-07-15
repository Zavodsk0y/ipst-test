import { Albums, DB } from "@common/types/kysely/db.type";
import { type Insertable, type Kysely, Transaction } from "kysely";

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

export async function getWithImagesById(con: Kysely<DB>, albumId: string) {
    const album = await con.selectFrom("albums").select(["id", "name", "created_at"]).where("id", "=", albumId).executeTakeFirst();

    const images = await con.selectFrom("images").select(["id", "file_name", "path", "size_bytes"]).where("album_id", "=", albumId).execute();

    return {
        ...album,
        images
    };
}

export async function removeById(con: Kysely<DB> | Transaction<DB>, id: string) {
    return await con.deleteFrom("albums").where("id", "=", id).execute();
}
