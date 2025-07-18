import type { FastifySchema } from "fastify";
import { z } from "zod";

export const fileDataSchema = z.object({
    filename: z.string(),
    mimetype: z.string(),
    encoding: z.string(),
    fieldname: z.string(),
    size: z.string()
});

export const uploadImageBodySchema = z.object({
    albumId: z.string().uuid().optional(),
    fileBuffer: z.custom<Buffer>((val) => Buffer.isBuffer(val)),
    fileData: fileDataSchema
});

export const uploadImageFastifySchema: FastifySchema = {
    body: uploadImageBodySchema
};

export interface IUploadImageFastifySchema {
    Body: z.infer<typeof uploadImageBodySchema>;
}
