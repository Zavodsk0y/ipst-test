import { imagesIdsSchema } from "@image/schemas/images-ids.schema";
import type { FastifySchema } from "fastify";
import { z } from "zod";

export const deattachFromAlbumFastifySchema: FastifySchema = {
    body: imagesIdsSchema
};

export interface IDeattachFromAlbumFastifySchema {
    Body: z.infer<typeof imagesIdsSchema>;
}
