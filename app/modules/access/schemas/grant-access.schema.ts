import { FastifySchema } from "fastify";
import { z } from "zod";
import { getByUuidFastifySchema, getByUuidFastifySchemaType } from "../../shared/schemas/get-by-uuid.schema";

const idSchema = z.object({
    id: z.string()
});

const usersSchema = z.object({
    users: z.array(idSchema)
});

export type GrantAccessFastifySchemaType = z.infer<typeof usersSchema>;
export const grantAccessFastifySchema: FastifySchema = {
    body: usersSchema,
    params: getByUuidFastifySchema.params
};

export interface IGrantAccessFastifySchema {
    Body: GrantAccessFastifySchemaType;
    Params: getByUuidFastifySchemaType;
}
