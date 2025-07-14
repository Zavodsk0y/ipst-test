import type { FastifyInstance } from "fastify";
import { getByUuidFastifySchema } from "../shared/schemas/get-by-uuid.schema";
import * as albumController from "./controller.album";
import { albumGetGuard } from "./guards/album-get-guard";
import { albumGuard } from "./guards/album-guard";
import { createAlbumFastifySchema } from "./schemas/create-album.schema";

export const albumRouter = async (app: FastifyInstance) => {
    app.post("/", { schema: createAlbumFastifySchema }, albumController.create);
    app.get("/", {}, albumController.getAll);
    app.get("/:id", { schema: getByUuidFastifySchema, preHandler: app.auth([albumGetGuard]) }, albumController.getOne);
    app.delete("/:id", { schema: getByUuidFastifySchema, preHandler: app.auth([albumGuard]) }, albumController.remove);
    app.get("/shared", {}, albumController.getShared);
};
