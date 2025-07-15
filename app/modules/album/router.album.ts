import * as albumController from "@album/controller.album";
import { albumGetGuard } from "@album/guards/album-get-guard";
import { albumGuard } from "@album/guards/album-guard";
import { createAlbumFastifySchema } from "@album/schemas/create-album.schema";
import { getByUuidFastifySchema } from "@shared/schemas/get-by-uuid.schema";
import type { FastifyInstance } from "fastify";

export const albumRouter = async (app: FastifyInstance) => {
    app.post("/", { schema: createAlbumFastifySchema }, albumController.create);
    app.get("/", {}, albumController.getAll);
    app.get("/:id", { schema: getByUuidFastifySchema, preHandler: app.auth([albumGetGuard]) }, albumController.getOne);
    app.delete("/:id", { schema: getByUuidFastifySchema, preHandler: app.auth([albumGuard]) }, albumController.remove);
    app.get("/shared", {}, albumController.getShared);
};
