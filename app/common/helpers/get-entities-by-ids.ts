import { NotFoundException } from "@common/exceptions/not-found-exception";
import { Kysely } from "kysely";

export async function getEntitiesByIds<Entity extends { id: string }, DB>(
    con: Kysely<DB>,
    getByIdsFunction: (con: Kysely<DB>, ids: string[]) => Promise<Entity[]>,
    ids: string[]
): Promise<Entity[]> {
    const entities = await getByIdsFunction(con, ids);

    if (entities.length !== ids.length) {
        const foundIds = new Set(entities.map((e) => e.id));
        const missingIds = ids.filter((id) => !foundIds.has(id));
        throw new NotFoundException(`Some entities not found: ${missingIds.join(", ")}`);
    }

    return entities;
}
