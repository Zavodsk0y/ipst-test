import { globalAuthHook } from "@common/config/global-auth";
import { jwtOption } from "@common/config/jwt";
import { KyselyConfig } from "@common/config/kysely-config";
import { AppErrorPipe, ZodValidatorCompiler } from "@common/config/pipe";
import { swaggerOption, swaggerUiOption } from "@common/config/swagger";
import fastifyAuth from "@fastify/auth";
import { fastifyCors } from "@fastify/cors";
import { fastifyJwt } from "@fastify/jwt";
import fastifyMultipart from "@fastify/multipart";
import { fastifyStatic } from "@fastify/static";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { HttpProvider } from "@modules/_index";
import { fastify, FastifyInstance } from "fastify";
import * as fs from "node:fs/promises";
import path from "node:path";

export async function buildApp(): Promise<FastifyInstance> {
    const app: FastifyInstance = fastify();

    const publicDir = path.join(process.cwd(), "public");
    const uploadsDir = path.join(publicDir, "uploads");

    try {
        await fs.access(publicDir);
    } catch {
        await fs.mkdir(publicDir, { recursive: true });
    }

    try {
        await fs.access(uploadsDir);
    } catch {
        await fs.mkdir(uploadsDir, { recursive: true });
    }

    app.setValidatorCompiler(ZodValidatorCompiler);
    app.setErrorHandler(AppErrorPipe);
    await app.register(fastifyCors, {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["Content-Disposition", "set-cookie"]
    });
    app.register(fastifyMultipart, {
        attachFieldsToBody: true,
        limits: {
            fileSize: 5 * 1024 * 1024
        }
    });
    app.register(fastifyStatic, {
        root: path.join(process.cwd(), "public"),
        prefix: "/public/",
        decorateReply: false
    });
    app.register(fastifySwagger, swaggerOption);
    app.register(fastifySwaggerUi, swaggerUiOption);
    await app.register(KyselyConfig);
    await app.register(fastifyJwt, jwtOption);
    await app.register(fastifyAuth, { defaultRelation: "or" });
    await globalAuthHook(app);

    HttpProvider.forEach((router) => app.register(router.instance, { prefix: router.prefix }));

    return app;
}
