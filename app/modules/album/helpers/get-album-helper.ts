import { sqlCon } from "../../../common/config/kysely-config";
import { NotFoundException } from "../../../common/exceptions/not-found-exception";
import * as albumRepository from "../repository.album";

export async function getAlbum(albumId: string) {
    const album = await albumRepository.getById(sqlCon, albumId);

    if (!album) throw new NotFoundException("Album not found");

    return album;
}
