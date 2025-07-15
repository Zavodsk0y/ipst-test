import { accessRouter } from "@access/router.access";
import { albumRouter } from "@album/router.album";
import { imageRouter } from "@image/router.image";
import { userRouter } from "@user/router.user";
import type { FastifyInstance } from "fastify";

interface IProvider {
    instance: (app: FastifyInstance) => Promise<void>;
    prefix: string;
}

export const HttpProvider: IProvider[] = [
    { instance: userRouter, prefix: "users" },
    { instance: albumRouter, prefix: "albums" },
    { instance: accessRouter, prefix: "accesses" },
    { instance: imageRouter, prefix: "images" }
] as IProvider[];
