import type { FastifyInstance } from "fastify";
import { albumRouter } from "./album/router.album";
import { userRouter } from "./user/router.user";

interface IProvider {
    instance: (app: FastifyInstance) => Promise<void>;
    prefix: string;
}

export const HttpProvider: IProvider[] = [
    { instance: userRouter, prefix: "users" },
    { instance: albumRouter, prefix: "albums" }
] as IProvider[];
