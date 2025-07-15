import * as accessRepository from "@access/repository.access";
import * as albumRepository from "@album/repository.album";
import { sqlCon } from "@common/config/kysely-config";
import { AccessDeniedException } from "@common/exceptions/access-denied-exception";
import { getEntityById } from "@common/helpers/get-entity-by-id";
import { UserRoleEnum } from "@common/types/kysely/db.type";
import { IGetByUuidFastifySchema } from "@shared/schemas/get-by-uuid.schema";
import { FastifyRequest } from "fastify";

export async function albumGetGuard(req: FastifyRequest<IGetByUuidFastifySchema>) {
    const album = await getEntityById(sqlCon, albumRepository.getById, req.params.id);

    if (req.user.role === ("admin" as UserRoleEnum)) return;
    if (album!.user_id === req.user.id) return;

    const hasAccess = await accessRepository.getByUserId(sqlCon, req.user.id);

    if (!hasAccess) {
        throw new AccessDeniedException("You have no access to this album");
    }
}
