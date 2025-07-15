import { albumGuard } from "@album/guards/album-guard";
import * as imageController from "@image/controller.image";
import { imageGuard } from "@image/guards/image-guard";
import { uploadImagePreValidation } from "@image/prevalidation/upload-image-prevalidation";
import { attachToAlbumFastifySchema } from "@image/schemas/attach-to-album.schema";
import { deattachFromAlbumFastifySchema } from "@image/schemas/deattach-from-album.schema";
import { getImagesFastifySchema } from "@image/schemas/get-images.schema";
import { uploadImageFastifySchema } from "@image/schemas/upload-image.schema";
import { getByUuidFastifySchema } from "@shared/schemas/get-by-uuid.schema";
import type { FastifyInstance } from "fastify";

export const imageRouter = async (app: FastifyInstance) => {
    app.post("/", { schema: uploadImageFastifySchema, preValidation: uploadImagePreValidation }, imageController.upload);
    app.get("/", { schema: getImagesFastifySchema }, imageController.getAll);
    app.get("/:id", { schema: getByUuidFastifySchema, preHandler: app.auth([imageGuard]) }, imageController.getOne);
    app.delete("/:id", { schema: getByUuidFastifySchema, preHandler: app.auth([imageGuard]) }, imageController.remove);
    app.post("/attach/:id", { schema: attachToAlbumFastifySchema, preHandler: app.auth([albumGuard]) }, imageController.attachToAlbum);
    // TODO: Make new detach guard, make get enities helper
    app.post("/deattach", { schema: deattachFromAlbumFastifySchema, preHandler: app.auth([imageGuard]) }, imageController.deattachFromAlbum);
};
