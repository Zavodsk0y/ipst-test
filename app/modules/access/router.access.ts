import type { FastifyInstance } from "fastify";
import { albumGuard } from "../album/guards/album-guard";
import { getByUuidFastifySchema } from "../shared/schemas/get-by-uuid.schema";
import * as accessController from "./controller.access";
import { grantAccessFastifySchema } from "./schemas/grant-access.schema";

export const accessRouter = async (app: FastifyInstance) => {
    app.post("/:id", { schema: grantAccessFastifySchema, preHandler: app.auth([albumGuard]) }, accessController.create);
    app.get("/:id", { schema: getByUuidFastifySchema, preHandler: app.auth([albumGuard]) }, accessController.getGranted);
};
