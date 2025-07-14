import { FastifyReply } from "fastify";
import { sqlCon } from "../../../common/config/kysely-config";
import { HandlingErrorType } from "../../../common/enum/error-types";
import { HttpStatusCode } from "../../../common/enum/http-status-code";
import * as albumRepository from "../repository.album";

export async function getAlbum(albumId: string, rep: FastifyReply) {
    const album = await albumRepository.getById(sqlCon, albumId);

    if (!album) {
        const info = { type: HandlingErrorType.Found, property: "id" };
        return rep.code(HttpStatusCode.NOT_FOUND).send(info);
    }

    return album;
}
