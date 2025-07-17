import { albumGuard } from "@album/guards/album-guard";
import * as imageController from "@image/controller.image";
import { imageGuard } from "@image/guards/image-guard";
import { imageInteractionGuard } from "@image/guards/images-interaction-guard";
import { uploadImagePreValidation } from "@image/prevalidation/upload-image-prevalidation";
import { getImagesFastifySchema } from "@image/schemas/get-images.schema";
import { interactWithImagesFastifySchema } from "@image/schemas/interact-with-images.schema";
import { uploadImageFastifySchema } from "@image/schemas/upload-image.schema";
import { getByUuidFastifySchema } from "@shared/schemas/get-by-uuid.schema";
import type { FastifyInstance } from "fastify";

export const imageRouter = async (app: FastifyInstance) => {
    app.post("/", { schema: uploadImageFastifySchema, preValidation: uploadImagePreValidation }, imageController.upload);
    app.get("/", { schema: getImagesFastifySchema }, imageController.getAll);
    app.get("/:id", { schema: getByUuidFastifySchema, preHandler: app.auth([imageGuard]) }, imageController.getOne);
    app.delete("/:id", { schema: getByUuidFastifySchema, preHandler: app.auth([imageGuard]) }, imageController.remove);
    app.post("/attach/:id", { schema: interactWithImagesFastifySchema, preHandler: app.auth([albumGuard, imageInteractionGuard]) }, imageController.attachToAlbum);
    app.post("/detach/:id", { schema: interactWithImagesFastifySchema, preHandler: app.auth([albumGuard, imageInteractionGuard]) }, imageController.detachFromAlbum);
};
