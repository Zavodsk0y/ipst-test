import { JwtTypes } from "@common/enum/jwt-types";
import { UserRoleEnum } from "@common/types/kysely/db.type";
import jwt, { SignOptions } from "jsonwebtoken";
import ms from "ms";

export const generateJwt = (id: string, type: JwtTypes, role: UserRoleEnum) => {
    const secret = type === JwtTypes.REFRESH ? process.env.JWT_REFRESH_SECRET! : process.env.JWT_SECRET!;
    const expiresIn = type === JwtTypes.REFRESH ? process.env.JWT_REFRESH_SECRET_DURATION! : process.env.JWT_SECRET_DURATION!;

    const options: SignOptions = {
        expiresIn: expiresIn as ms.StringValue
    };

    return jwt.sign({ id, type, role }, secret, options);
};

export const verifyJwt = (token: string, expectedType: JwtTypes) => {
    const secret = expectedType === JwtTypes.REFRESH ? process.env.JWT_REFRESH_SECRET! : process.env.JWT_SECRET!;
    return jwt.verify(token, secret) as { id: string; type: JwtTypes; role: UserRoleEnum };
};
