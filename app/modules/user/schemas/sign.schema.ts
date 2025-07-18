import type { FastifySchema } from "fastify";
import { z } from "zod";

const schema = z.object({
    email: z.string().email().min(1).max(255),
    password: z.string().min(8).max(255)
});

export const signUserFastifySchema: FastifySchema = { body: schema };

export interface ISignUserFastifySchema {
    Body: z.infer<typeof schema>;
}
