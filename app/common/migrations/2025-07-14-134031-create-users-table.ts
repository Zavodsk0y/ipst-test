import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>) {
    await sql`CREATE TYPE user_role_enum AS ENUM ('user', 'admin')`.execute(db);

    await db.schema
        .createTable("users")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn("email", "varchar(255)", (col) => col.unique().notNull())
        .addColumn("password", "varchar(255)", (col) => col.notNull())
        .addColumn("role", sql`user_role_enum`, (col) => col.notNull().defaultTo("user"))
        .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
        .execute();
}

export async function down(db: Kysely<any>) {
    await db.schema.dropTable("users").execute();
    await sql`DROP TYPE user_role`.execute(db);
}
