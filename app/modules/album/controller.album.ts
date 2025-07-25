import * as accessRepository from "@access/repository.access";
import * as albumRepository from "@album/repository.album";
import { ICreateAlbumFastifySchema } from "@album/schemas/create-album.schema";
import { sqlCon } from "@common/config/kysely-config";
import { HttpStatusCode } from "@common/enum/http-status-code";
import { getEntityById } from "@common/helpers/get-entity-by-id";
import { IGetByUuidFastifySchema } from "@shared/schemas/get-by-uuid.schema";
import { FastifyReply, FastifyRequest } from "fastify";

export async function create(req: FastifyRequest<ICreateAlbumFastifySchema>, rep: FastifyReply) {
    const data = {
        name: req.body.name,
        user_id: req.user.id
    };

    const insertedAlbum = await albumRepository.insert(sqlCon, data);

    return rep.code(HttpStatusCode.CREATED).send(insertedAlbum);
}

export async function getAll(req: FastifyRequest, rep: FastifyReply) {
    const albums = await albumRepository.getAllByUserId(sqlCon, req.user.id);

    return rep.code(HttpStatusCode.OK).send(albums);
}

export async function getOne(req: FastifyRequest<IGetByUuidFastifySchema>, rep: FastifyReply) {
    const album = await getEntityById(sqlCon, albumRepository.getWithImagesById, req.params.id);

    return rep.code(HttpStatusCode.OK).send(album);
}

export async function remove(req: FastifyRequest<IGetByUuidFastifySchema>, rep: FastifyReply) {
    const album = await getEntityById(sqlCon, albumRepository.getById, req.params.id);

    await albumRepository.removeById(sqlCon, album!.id);

    return rep.code(HttpStatusCode.NO_CONTENT).send();
}

export async function getShared(req: FastifyRequest, rep: FastifyReply) {
    const albums = await accessRepository.getAccessibleAlbumsByUserId(sqlCon, req.user.id);

    return rep.code(HttpStatusCode.OK).send(albums);
}
