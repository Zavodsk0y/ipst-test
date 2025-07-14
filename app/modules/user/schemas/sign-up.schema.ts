import type { FastifySchema } from "fastify";
import { z } from "zod";

const schema = z.object({
    name: z.string().min(1).max(255),
    email: z.string().email().min(1).max(255),
    password: z.string().min(8).max(255)
});

export const signupUserFastifySchema: FastifySchema = { body: schema };

export interface ISignupUserFastifySchema {
    Body: z.infer<typeof schema>;
}
