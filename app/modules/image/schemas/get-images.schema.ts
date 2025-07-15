import { paginationSchema } from "@shared/schemas/pagination.schema";
import type { FastifySchema } from "fastify";
import { z } from "zod";

const schema = paginationSchema.extend({
    albumName: z.string().min(1).max(255).optional()
});

export const getImagesFastifySchema: FastifySchema = { querystring: schema };
export type getImagesFastifySchemaType = z.infer<typeof schema>;

export interface IGetImagesFastifySchema {
    Querystring: z.infer<typeof schema>;
}
