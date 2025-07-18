import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema
        .createTable("granted_accesses")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn("user_id", "uuid", (col) => col.references("users.id").onDelete("cascade").notNull())
        .addColumn("album_id", "uuid", (col) => col.references("albums.id").onDelete("cascade").notNull())
        .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
        .execute();

    await db.schema.createIndex("user_id_on_granted_accesses_index").on("granted_accesses").column("user_id").execute();
    await db.schema.createIndex("album_id_on_granted_accesses_index").on("granted_accesses").column("album_id").execute();
}

export async function down(db: Kysely<any>) {
    await db.schema.dropTable("granted_accesses").execute();
}
