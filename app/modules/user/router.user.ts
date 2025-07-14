import type { FastifyInstance } from "fastify";
import * as userController from "./controller.user";
import { loginUserFastifySchema } from "./schemas/login.schema";
import { signupUserFastifySchema } from "./schemas/sign-up.schema";

export const userRouter = async (app: FastifyInstance) => {
    app.post("/signup", { schema: signupUserFastifySchema, config: { isPublic: true } }, userController.create);
    app.post("/login", { schema: loginUserFastifySchema, config: { isPublic: true } }, userController.login);
};
