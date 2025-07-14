import type { FastifySchema } from "fastify";
import { z } from "zod";

const schema = z.object({
    refreshToken: z.string().max(255)
});

export const refreshTokenFastifySchema: FastifySchema = { body: schema };

export interface IRefreshTokenFastifySchema {
    Body: z.infer<typeof schema>;
}
