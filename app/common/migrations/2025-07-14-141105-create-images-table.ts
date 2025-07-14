import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema
        .createTable("images")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn("album_id", "uuid", (col) => col.references("albums.id").onDelete("cascade"))
        .addColumn("file_name", "varchar(255)", (col) => col.unique().notNull())
        .addColumn("path", "varchar(255)", (col) => col.unique().notNull())
        .addColumn("extension", "varchar(255)", (col) => col.notNull())
        .addColumn("mime_type", "varchar(255)", (col) => col.notNull())
        .addColumn("size_bytes", "varchar(255)", (col) => col.notNull())
        .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
        .execute();
}

export async function down(db: Kysely<any>) {
    await db.schema.dropTable("images").execute();
}
