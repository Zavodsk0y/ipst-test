import { imagesIdsSchema } from "@image/schemas/images-ids.schema";
import { getByUuidFastifySchema, getByUuidFastifySchemaType } from "@shared/schemas/get-by-uuid.schema";
import type { FastifySchema } from "fastify";
import { z } from "zod";

export const attachToAlbumFastifySchema: FastifySchema = {
    body: imagesIdsSchema,
    params: getByUuidFastifySchema.params
};

export interface IAttachToAlbumFastifySchema {
    Body: z.infer<typeof imagesIdsSchema>;
    Params: getByUuidFastifySchemaType;
}
