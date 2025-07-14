import bcrypt from "bcrypt";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { IHandlingResponseError } from "../../common/config/http-response.ts";
import { sqlCon } from "../../common/config/kysely-config";
import { HandlingErrorType } from "../../common/enum/error-types";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import * as userRepository from "./repository.user";
import type { ILoginUserFastifySchema } from "./schemas/login.schema.ts";
import { ISignupUserFastifySchema } from "./schemas/sign-up.schema";
import { makeToken } from "./utils/make-token";

export async function create(req: FastifyRequest<ISignupUserFastifySchema>, rep: FastifyReply) {
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
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    };

    const insertedUser = await userRepository.insert(sqlCon, user);

    return rep.code(HttpStatusCode.CREATED).send({
        id: insertedUser.id
    });
}

export async function login(req: FastifyRequest<ILoginUserFastifySchema>, rep: FastifyReply) {
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

    const token = await makeToken(user.id);

    return rep.code(HttpStatusCode.OK).send({
        id: user.id,
        accessToken: token
    });
}
