import { logger } from "@common/config/pino-plugin";
import { HttpStatusCode } from "@common/enum/http-status-code";
import { AccessDeniedException } from "@common/exceptions/access-denied-exception";
import { CustomException } from "@common/exceptions/custom-exception";
import { NotFoundException } from "@common/exceptions/not-found-exception";
import { errorCodes, type FastifyError, type FastifyReply, type FastifyRequest } from "fastify";
import { z, ZodError, ZodObject } from "zod";

export async function AppErrorPipe(err: any, req: FastifyRequest, reply: FastifyReply) {
    const parentLogger = logger.child({ req_id: req.id });
    if (err.code == errorCodes.FST_ERR_VALIDATION().code && err instanceof z.ZodError) {
        const errors = err.issues.map(({ code: type, path: stack, message }) => ({ type, stack, message }));
        return reply.code(HttpStatusCode.UNPROCESSABLE_ENTITY).send({ errors });
    }

    if (err instanceof AccessDeniedException) {
        return reply.code(HttpStatusCode.FORBIDDEN).send(err.details);
    }

    if (err instanceof NotFoundException) {
        return reply.code(HttpStatusCode.NOT_FOUND).send(err.details);
    }

    if (err instanceof CustomException) {
        parentLogger.error({ url: req.url, method: req.method }, "Route");

        if (req.body) parentLogger.error(req.body, "Body: ");

        if (req.query && Object.keys(req.query).length !== 0) parentLogger.error(req.query, "Query");

        if (req.params && Object.keys(req.params).length !== 0) parentLogger.error(req.params, "Params");

        parentLogger.error(err, "Handled error");

        reply.code(err.status);
        if (err.publicMessage !== undefined) {
            reply.send(err.publicMessage);
        }

        return;
    }

    if ((err["statusCode"] !== undefined && err["statusCode"] === HttpStatusCode.INTERNAL_SERVER_ERROR) || err["statusCode"] === undefined) {
        parentLogger.error({ url: req.url, originalUrl: req.originalUrl, method: req.method }, "Route");

        if (req.body) parentLogger.error(req.body, "Body");

        if (req.query && Object.keys(req.query).length !== 0) parentLogger.error(req.query, "Query");

        if (req.params && Object.keys(req.params).length !== 0) parentLogger.error(req.params, "Params");

        parentLogger.error(err, "Handled error");

        reply.code(HttpStatusCode.INTERNAL_SERVER_ERROR);
        return { message: "Oops, something went wrong" };
    }

    reply.code(err["statusCode"]);
    return { message: err["message"] };
}

export const ZodValidatorCompiler = ({ schema }: { schema: ZodObject<any> }) => {
    return (data: unknown) => {
        const result = schema.safeParse(data);
        if (result.success) {
            return { value: result.data };
        } else {
            const zodError = result.error;

            (zodError as unknown as FastifyError).code = errorCodes.FST_ERR_VALIDATION().code;

            return { error: zodError as ZodError & FastifyError };
        }
    };
};
