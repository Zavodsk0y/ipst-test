import { type Kysely } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema
        .alterTable("albums")
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .execute();
}

export async function down(db: Kysely<any>) {
    await db.schema.alterTable("albums").dropColumn("name").execute();
}
