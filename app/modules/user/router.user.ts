import type { FastifyInstance } from "fastify";
import * as userController from "./controller.user";
import { refreshTokenFastifySchema } from "./schemas/refresh-tokens.schema";
import { signUserFastifySchema } from "./schemas/sign.schema";

export const userRouter = async (app: FastifyInstance) => {
    app.post("/signup", { schema: signUserFastifySchema, config: { isPublic: true } }, userController.create);
    app.post("/login", { schema: signUserFastifySchema, config: { isPublic: true } }, userController.login);
    app.post("/refresh-tokens", { schema: refreshTokenFastifySchema }, userController.refreshTokens);
};
