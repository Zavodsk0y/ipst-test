import type { FastifySchema } from "fastify";
import { z } from "zod";

const schema = z.object({
    name: z.string().min(1).max(255)
});

export const createAlbumFastifySchema: FastifySchema = { body: schema };

export interface ICreateAlbumFastifySchema {
    Body: z.infer<typeof schema>;
}
