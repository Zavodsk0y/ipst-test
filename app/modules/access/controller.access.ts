import * as accessRepository from "@access/repository.access";
import { IGrantAccessFastifySchema } from "@access/schemas/grant-access.schema";
import { getAlbum } from "@album/helpers/get-album-helper";
import { sqlCon } from "@common/config/kysely-config";
import { HttpStatusCode } from "@common/enum/http-status-code";
import { CustomException } from "@common/exceptions/custom-exception";
import { IGetByUuidFastifySchema } from "@shared/schemas/get-by-uuid.schema";
import { FastifyReply, FastifyRequest } from "fastify";

export async function create(req: FastifyRequest<IGrantAccessFastifySchema>, rep: FastifyReply) {
    const album = await getAlbum(req.params.id);

    const usersIds = req.body.users.map((user) => user.id);

    const ownerIsAddingYourself = usersIds.some((userId) => {
        return userId === req.user.id;
    });

    if (ownerIsAddingYourself) {
        throw new CustomException(HttpStatusCode.CONFLICT, "You are trying to grant access to yourself", {
            publicMessage: "You are trying to grant access to yourself"
        });
    }

    const existingAccesses = await accessRepository.getByUsersAndAlbumId(sqlCon, usersIds, album.id);

    if (existingAccesses.length > 0) {
        throw new CustomException(HttpStatusCode.CONFLICT, "Access already exists", {
            publicMessage: {
                message: "Accesses already exist for these users",
                usersIds: existingAccesses.map((user) => user.user_id)
            }
        });
    }

    await accessRepository.insertMany(
        sqlCon,
        usersIds.map((userId) => ({
            user_id: userId,
            album_id: album.id
        }))
    );

    return rep.code(HttpStatusCode.CREATED).send({
        message: "You've successfully shared an album",
        users: await accessRepository.getGrantedUsersByAlbumId(sqlCon, album.id),
        album: album
    });
}

export async function getGranted(req: FastifyRequest<IGetByUuidFastifySchema>, rep: FastifyReply) {
    const album = await getAlbum(req.params.id);

    const users = await accessRepository.getGrantedUsersByAlbumId(sqlCon, album.id);

    return rep.code(HttpStatusCode.OK).send({
        album: album,
        users: users
    });
}
