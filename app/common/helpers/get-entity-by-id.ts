import { NotFoundException } from "@common/exceptions/not-found-exception";
import { Kysely } from "kysely";

export async function getEntityById<Entity, DB>(con: Kysely<DB>, getByIdFunction: (con: Kysely<DB>, id: string) => Promise<Entity | null>, id: string): Promise<Entity> {
    const entity = await getByIdFunction(con, id);

    if (!entity) throw new NotFoundException("Entity not found");

    return entity;
}
