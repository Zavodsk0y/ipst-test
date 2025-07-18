import type { IHandlingResponseError } from "@common/config/http-response";
import { sqlCon } from "@common/config/kysely-config";
import { HandlingErrorType } from "@common/enum/error-types";
import { HttpStatusCode } from "@common/enum/http-status-code";
import { JwtTypes } from "@common/enum/jwt-types";
import { verifyJwt } from "@shared/utils/jwt-utils";
import * as refreshTokenRepository from "@user/repository.token";
import * as userRepository from "@user/repository.user";
import { IRefreshTokenFastifySchema } from "@user/schemas/refresh-tokens.schema";
import { ISignUserFastifySchema } from "@user/schemas/sign.schema";
import { makeTokens } from "@user/utils/make-tokens";
import bcrypt from "bcrypt";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function create(req: FastifyRequest<ISignUserFastifySchema>, rep: FastifyReply) {
    const emailExists = await userRepository.getByEmail(sqlCon, req.body.email);

    if (emailExists) {
        const info: IHandlingResponseError = {
            type: HandlingErrorType.Unique,
            property: "email",
            message: "Введенный email уже существует"
        };
        return rep.code(HttpStatusCode.CONFLICT).send(info);
    }

    const hashPassword = await bcrypt.hash(req.body.password, 5);

    const user = {
        email: req.body.email,
        password: hashPassword
    };

    const insertedUser = await userRepository.insert(sqlCon, user);

    return rep.code(HttpStatusCode.CREATED).send({
        id: insertedUser.id
    });
}

export async function login(req: FastifyRequest<ISignUserFastifySchema>, rep: FastifyReply) {
    const user = await userRepository.getByEmail(sqlCon, req.body.email);

    if (!user) {
        const info: IHandlingResponseError = { type: HandlingErrorType.Found, property: "email" };
        return rep.code(HttpStatusCode.NOT_FOUND).send(info);
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password!);
    if (!isPasswordValid) {
        const info: IHandlingResponseError = { type: HandlingErrorType.Match, property: "password" };
        return rep.code(HttpStatusCode.UNAUTHORIZED).send(info);
    }

    const session = await refreshTokenRepository.getByUserId(sqlCon, user.id);
    const tokens = await makeTokens(user.id, user.role, session);

    return rep.code(HttpStatusCode.OK).send({
        id: user.id,
        ...tokens
    });
}

export async function refreshTokens(req: FastifyRequest<IRefreshTokenFastifySchema>, rep: FastifyReply) {
    let user;
    try {
        user = verifyJwt(req.body.refreshToken, JwtTypes.REFRESH);
    } catch {
        const info: IHandlingResponseError = {
            type: HandlingErrorType.Match,
            property: "token"
        };
        return rep.code(HttpStatusCode.BAD_REQUEST).send(info);
    }

    const session = await refreshTokenRepository.getByUserIdAndRefreshToken(sqlCon, user.id, req.body.refreshToken);

    if (!session) {
        const info: IHandlingResponseError = { type: HandlingErrorType.Found, property: "token" };
        return rep.code(HttpStatusCode.NOT_FOUND).send(info);
    }

    const tokens = await makeTokens(user.id, user.role, session);

    return rep.code(HttpStatusCode.OK).send(tokens);
}
