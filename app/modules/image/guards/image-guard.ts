import { sqlCon } from "@common/config/kysely-config";
import { AccessDeniedException } from "@common/exceptions/access-denied-exception";
import { getEntityById } from "@common/helpers/get-entity-by-id";
import { UserRoleEnum } from "@common/types/kysely/db.type";
import * as imageRepository from "@image/repository.image";
import { IGetByUuidFastifySchema } from "@shared/schemas/get-by-uuid.schema";
import { FastifyRequest } from "fastify";

export async function imageGuard(req: FastifyRequest<IGetByUuidFastifySchema>) {
    const image = await getEntityById(sqlCon, imageRepository.getById, req.params.id);

    if (req.user.role === ("admin" as UserRoleEnum)) return;
    if (image!.user_id !== req.user.id) throw new AccessDeniedException("You have no access to this image");
}
