import { type Kysely } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema
        .alterTable("images")
        .addColumn("user_id", "uuid", (col) => col.references("users.id").onDelete("cascade").notNull())
        .execute();

    await db.schema.createIndex("user_id_on_images_index").on("images").column("user_id").execute();
}

export async function down(db: Kysely<any>) {
    await db.schema.alterTable("albums").dropColumn("name").execute();
}
