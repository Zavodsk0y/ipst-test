import * as albumRepository from "@album/repository.album";
import { sqlCon } from "@common/config/kysely-config";
import { HttpStatusCode } from "@common/enum/http-status-code";
import { getEntitiesByIds } from "@common/helpers/get-entities-by-ids";
import { getEntityById } from "@common/helpers/get-entity-by-id";
import { MimeTypeEnum } from "@common/types/kysely/db.type";
import * as imageRepository from "@image/repository.image";
import { IGetImagesFastifySchema } from "@image/schemas/get-images.schema";
import { IAttachImagesToAlbumFastifySchema, IDetachImagesFromAlbumFastifySchema } from "@image/schemas/interact-with-images.schema";
import { IUploadImageFastifySchema } from "@modules/image/schemas/upload-image.schema";
import { IGetByUuidFastifySchema } from "@shared/schemas/get-by-uuid.schema";
import { FastifyReply, FastifyRequest } from "fastify";
import crypto from "node:crypto";
import * as fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

export async function upload(req: FastifyRequest<IUploadImageFastifySchema>, rep: FastifyReply) {
    const fileName = `${crypto.randomBytes(10).toString("hex")}${path.extname(req.body.fileData.filename)}`;
    const publicDir = process.env.PUBLIC_DIRECTORY || "public/uploads";
    const publicPath = `/${publicDir.split(path.sep).join("/")}/${fileName}`;
    const savePath = path.join(process.cwd(), publicDir, fileName);
    try {
        const stream = new Readable({
            read() {
                this.push(req.body.fileBuffer);
                this.push(null);
            }
        });

        await pipeline(stream, fs.createWriteStream(savePath));

        const data = {
            file_name: fileName,
            extension: path.extname(req.body.fileData.filename),
            mime_type: req.body.fileData.mimetype as MimeTypeEnum,
            album_id: req.body.albumId,
            path: publicPath,
            user_id: req.user.id,
            size_bytes: req.body.fileData.size
        };

        const insertedImage = await imageRepository.insert(sqlCon, data);

        return rep.code(HttpStatusCode.OK).send(insertedImage);
    } catch (error) {
        void fs.promises.unlink(savePath).catch(() => {});
        throw error;
    }
}

export async function getAll(req: FastifyRequest<IGetImagesFastifySchema>, rep: FastifyReply) {
    const images = await imageRepository.getAllByUserId(sqlCon, req.user.id, req.query);

    return rep.code(HttpStatusCode.OK).send(images);
}

export async function getOne(req: FastifyRequest<IGetByUuidFastifySchema>, rep: FastifyReply) {
    const image = await getEntityById(sqlCon, imageRepository.getById, req.params.id);

    return rep.code(HttpStatusCode.OK).send(image);
}

export async function remove(req: FastifyRequest<IGetByUuidFastifySchema>, rep: FastifyReply) {
    const image = await getEntityById(sqlCon, imageRepository.getById, req.params.id);

    const path = process.cwd() + image!.path;

    if (fs.existsSync(path)) {
        await fs.promises.unlink(path);
    }

    await imageRepository.removeById(sqlCon, image!.id);

    return rep.code(HttpStatusCode.NO_CONTENT).send();
}

export async function attachToAlbum(req: FastifyRequest<IAttachImagesToAlbumFastifySchema>, rep: FastifyReply) {
    const album = await getEntityById(sqlCon, albumRepository.getById, req.params.id);

    const alreadyAttached = await imageRepository.getAlreadyAttachedToAlbum(sqlCon, req.body.imagesIds);

    if (alreadyAttached.length > 0) {
        return rep.code(HttpStatusCode.CONFLICT).send({
            error: "Some of images already attached to album",
            images: alreadyAttached
        });
    }

    const attachedImages = await imageRepository.attachToAlbumByIds(sqlCon, req.body.imagesIds, album!.id);

    return rep.code(HttpStatusCode.OK).send(attachedImages);
}

export async function detachFromAlbum(req: FastifyRequest<IDetachImagesFromAlbumFastifySchema>, rep: FastifyReply) {
    const images = await getEntitiesByIds(sqlCon, imageRepository.getByIds, req.body.imagesIds);

    const notAttached = images.filter((image) => image.album_id === null);

    if (notAttached.length > 0) {
        return rep.code(HttpStatusCode.CONFLICT).send({
            error: "Some of images are not attached to any album",
            images: notAttached
        });
    }

    const detachedImages = await imageRepository.detachFromAlbumByIds(sqlCon, req.body.imagesIds);

    return rep.code(HttpStatusCode.OK).send(detachedImages);
}
