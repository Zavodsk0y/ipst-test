import type { FastifyInstance } from "fastify";
import { userRouter } from "./user/router.user";

interface IProvider {
    instance: (app: FastifyInstance) => Promise<void>;
    prefix: string;
}

export const HttpProvider: IProvider[] = [{ instance: userRouter, prefix: "users" }];
