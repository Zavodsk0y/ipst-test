import { withUrls } from "@common/helpers/get-with-urls";
import { DB, Images } from "@common/types/kysely/db.type";
import { getImagesFastifySchemaType } from "@image/schemas/get-images.schema";
import { Insertable, Kysely } from "kysely";
import * as process from "node:process";

type InsertableImageRowType = Insertable<Images>;

export async function insert(con: Kysely<DB>, entity: InsertableImageRowType) {
    const insertedImage = await con.insertInto("images").returningAll().values(entity).executeTakeFirstOrThrow();

    return withUrls(insertedImage, process.env.APP_URL!);
}

export async function getAllByUserId(con: Kysely<DB>, userId: string, querystring: getImagesFastifySchemaType) {
    const selectOptions = ["images.id", "images.album_id", "images.file_name", "images.extension", "images.mime_type", "images.path", "images.size_bytes"] as const;

    const query = con.selectFrom("images").leftJoin("albums", "albums.id", "images.album_id").where("images.user_id", "=", userId);

    const filteredQuery = querystring?.albumName ? query.where("albums.name", "ilike", `%${querystring.albumName}%`) : query;

    const images = await filteredQuery.select(selectOptions).limit(querystring.limit).offset(querystring.offset).execute();

    const total = await filteredQuery
        .select((eb) => eb.fn.countAll().as("total"))
        .executeTakeFirstOrThrow()
        .then((res) => Number(res.total));

    return { images: images.map((img) => withUrls(img, process.env.APP_URL!)), total };
}

export async function getById(con: Kysely<DB>, id: string) {
    const image = await con.selectFrom("images").selectAll().where("id", "=", id).executeTakeFirst();

    return image ? withUrls(image, process.env.APP_URL!) : undefined;
}

export async function getByIds(con: Kysely<DB>, ids: string[]) {
    return await con.selectFrom("images").selectAll().where("id", "in", ids).execute();
}

export async function removeById(con: Kysely<DB>, id: string) {
    return await con.deleteFrom("images").where("id", "=", id).execute();
}

export async function attachToAlbumByIds(con: Kysely<DB>, ids: string[], albumId: string) {
    const attachedImages = await con.updateTable("images").set({ album_id: albumId }).where("id", "in", ids).returningAll().execute();

    return attachedImages.map((img) => withUrls(img, process.env.APP_URL!));
}

export async function detachFromAlbumByIds(con: Kysely<DB>, ids: string[]) {
    const detachedImages = await con.updateTable("images").set({ album_id: null }).where("id", "in", ids).returningAll().execute();

    return detachedImages.map((img) => withUrls(img, process.env.APP_URL!));
}

export async function getAlreadyAttachedToAlbum(con: Kysely<DB>, ids: string[]) {
    return con.selectFrom("images").select(["id", "file_name", "album_id"]).where("id", "in", ids).where("album_id", "is not", null).execute();
}

export async function getNotAttachedToAlbum(con: Kysely<DB>, ids: string[]) {
    return con.selectFrom("images").select(["id", "file_name", "album_id"]).where("id", "in", ids).where("album_id", "is", null).execute();
}
