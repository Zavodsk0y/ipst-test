import { FileMigrationProvider, Kysely, Migrator, PostgresDialect } from "kysely";
import { promises as fs } from "node:fs";
import * as path from "node:path";
import { Pool } from "pg";
import type { DB } from "../types/kysely/db.type";

async function migrateFresh() {
    const db = new Kysely<DB>({
        dialect: new PostgresDialect({
            pool: new Pool({
                host: process.env.POSTGRES_HOST,
                port: Number(process.env.POSTGRES_PORT),
                user: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                database: process.env.POSTGRES_DATABASE
            })
        })
    });

    try {
        await db.schema.dropSchema("public").cascade().ifExists().execute();
        await db.schema.createSchema("public").ifNotExists().execute();

        console.log("✔ Database was successfully reset");

        const migrator = new Migrator({
            db,
            provider: new FileMigrationProvider({
                fs,
                path,
                migrationFolder: path.join(__dirname, "../migrations")
            })
        });

        const { error, results } = await migrator.migrateToLatest();

        results?.forEach((it) => {
            if (it.status === "Success") {
                console.log(`✔ Migration "${it.migrationName}" executed`);
            } else if (it.status === "Error") {
                console.error(`✖ Failed to execute "${it.migrationName}"`);
            }
        });

        if (error) {
            console.error("✖ Migration failed");
            console.error(error);
            process.exit(1);
        }

        console.log("✔ Database migrated to latest version");
    } finally {
        await db.destroy();
    }
}

migrateFresh();
