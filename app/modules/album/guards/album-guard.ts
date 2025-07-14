import { FastifyRequest } from "fastify";
import { AccessDeniedException } from "../../../common/exceptions/access-denied-exception";
import { UserRoleEnum } from "../../../common/types/kysely/db.type";
import { IGetByUuidFastifySchema } from "../../shared/schemas/get-by-uuid.schema";
import { getAlbum } from "../helpers/get-album-helper";

export async function albumGuard(req: FastifyRequest<IGetByUuidFastifySchema>) {
    const album = await getAlbum(req.params.id);

    if (req.user.role === ("admin" as UserRoleEnum)) return;
    if (album.user_id !== req.user.id) throw new AccessDeniedException("You have no access to delete this album");
}
