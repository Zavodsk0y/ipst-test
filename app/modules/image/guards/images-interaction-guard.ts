import { sqlCon } from "@common/config/kysely-config";
import { AccessDeniedException } from "@common/exceptions/access-denied-exception";
import { getEntitiesByIds } from "@common/helpers/get-entities-by-ids";
import { UserRoleEnum } from "@common/types/kysely/db.type";
import * as imageRepository from "@image/repository.image";
import { IInteractWithImagesFastifySchema } from "@image/schemas/interact-with-images.schema";
import { FastifyRequest } from "fastify";

export async function imageInteractionGuard(req: FastifyRequest<IInteractWithImagesFastifySchema>) {
    if (req.user.role === ("admin" as UserRoleEnum)) return;

    const images = await getEntitiesByIds(sqlCon, imageRepository.getByIds, req.body.imagesIds);

    const notOwnedImages = images.filter((img) => img.user_id !== req.user.id);
    if (notOwnedImages.length > 0) throw new AccessDeniedException("You have no access to these images");
}
