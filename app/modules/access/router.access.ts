import * as accessController from "@access/controller.access";
import { grantAccessFastifySchema } from "@access/schemas/grant-access.schema";
import { albumGuard } from "@album/guards/album-guard";
import { getByUuidFastifySchema } from "@shared/schemas/get-by-uuid.schema";
import type { FastifyInstance } from "fastify";

export const accessRouter = async (app: FastifyInstance) => {
    app.post("/:id", { schema: grantAccessFastifySchema, preHandler: app.auth([albumGuard]) }, accessController.create);
    app.get("/:id", { schema: getByUuidFastifySchema, preHandler: app.auth([albumGuard]) }, accessController.getGranted);
};
