import { imagesIdsSchema } from "@image/schemas/images-ids.schema";
import { getByUuidFastifySchema, getByUuidFastifySchemaType } from "@shared/schemas/get-by-uuid.schema";
import type { FastifySchema } from "fastify";
import { z } from "zod";

export const interactWithImagesFastifySchema: FastifySchema = {
    body: imagesIdsSchema,
    params: getByUuidFastifySchema.params
};

export interface IInteractWithImagesFastifySchema {
    Body: z.infer<typeof imagesIdsSchema>;
    Params: getByUuidFastifySchemaType;
}

export interface IAttachImagesToAlbumFastifySchema {
    Body: z.infer<typeof imagesIdsSchema>;
    Params: getByUuidFastifySchemaType;
}

export interface IDetachImagesFromAlbumFastifySchema {
    Body: z.infer<typeof imagesIdsSchema>;
    Params: getByUuidFastifySchemaType;
}
