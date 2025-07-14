import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>) {
    await sql`CREATE TYPE mime_type_enum AS ENUM ('image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp')`.execute(db);

    await db.schema
        .createTable("images")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn("album_id", "uuid", (col) => col.references("albums.id").onDelete("cascade"))
        .addColumn("file_name", "varchar(255)", (col) => col.unique().notNull())
        .addColumn("path", "varchar(255)", (col) => col.unique().notNull())
        .addColumn("extension", "varchar(255)", (col) => col.notNull())
        .addColumn("mime_type", sql`mime_type_enum`, (col) => col.notNull())
        .addColumn("size_bytes", "varchar(255)", (col) => col.notNull())
        .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
        .execute();

    await db.schema.createIndex("album_id_on_images_index").on("images").column("album_id").execute();
}

export async function down(db: Kysely<any>) {
    await db.schema.dropTable("images").execute();
}
