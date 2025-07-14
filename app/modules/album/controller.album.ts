import { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../common/config/kysely-config";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import { IGetByUuidFastifySchema } from "../shared/schemas/get-by-uuid.schema";
import { getAlbum } from "./helpers/get-album-helper";
import * as albumRepository from "./repository.album";
import { ICreateAlbumFastifySchema } from "./schemas/create-album.schema";

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
    const album = await getAlbum(req.params.id, rep);

    return rep.code(HttpStatusCode.OK).send(album);
}

export async function remove(req: FastifyRequest<IGetByUuidFastifySchema>, rep: FastifyReply) {
    const album = await getAlbum(req.params.id, rep);

    await albumRepository.removeById(sqlCon, album.id);

    return rep.code(HttpStatusCode.NO_CONTENT).send();
}
