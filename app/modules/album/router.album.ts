import type { FastifyInstance } from "fastify";
import { getByUuidFastifySchema } from "../shared/schemas/get-by-uuid.schema";
import * as albumController from "./controller.album";
import { createAlbumFastifySchema } from "./schemas/create-album.schema";

export const albumRouter = async (app: FastifyInstance) => {
    app.post("/", { schema: createAlbumFastifySchema }, albumController.create);
    app.get("/", {}, albumController.getAll);
    app.get("/:id", { schema: getByUuidFastifySchema }, albumController.getOne);
};
