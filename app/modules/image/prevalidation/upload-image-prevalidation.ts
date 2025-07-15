import { IHandlingResponseError } from "@common/config/http-response";
import { HandlingErrorType } from "@common/enum/error-types";
import { HttpStatusCode } from "@common/enum/http-status-code";
import { ImageMimeTypes } from "@common/enum/mimetypes";
import { IUploadImageFastifySchema } from "@modules/image/schemas/upload-image.schema";
import { FastifyReply, FastifyRequest } from "fastify";

export async function uploadImagePreValidation(req: FastifyRequest<IUploadImageFastifySchema>, rep: FastifyReply) {
    const data = await req.saveRequestFiles({ limits: { fileSize: 5 * 1024 * 1024, files: 1 } });
    const file = data[0]!;

    if (!file) {
        const info: IHandlingResponseError = { type: HandlingErrorType.Empty, property: "file" };
        return rep.code(HttpStatusCode.BAD_REQUEST).send(info);
    }

    if (!Object.values(ImageMimeTypes).includes(file.mimetype as ImageMimeTypes)) {
        const info = {
            type: HandlingErrorType.Allowed,
            property: "file",
            message: `Недопустимый формат файла. Разрешенные форматы: ${Object.values(ImageMimeTypes).join(", ")}`
        };
        return rep.code(HttpStatusCode.BAD_REQUEST).send(info);
    }

    const body = Object.fromEntries(Object.keys(req.body as Record<string, any>).map((key) => [key, (req.body as Record<string, any>)[key].value]));

    const buffer = await file.toBuffer();

    req.body = {
        albumId: body.albumId,
        fileBuffer: buffer,
        fileData: {
            filename: file.filename,
            mimetype: file.mimetype,
            encoding: file.encoding,
            fieldname: file.fieldname,
            size: String(buffer.length)
        }
    };
}
