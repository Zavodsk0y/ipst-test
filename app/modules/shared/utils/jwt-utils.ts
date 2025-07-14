import jwt, { SignOptions } from "jsonwebtoken";
import ms from "ms";

export const generateJwt = (id: string) => {
    const secret = process.env.JWT_SECRET!;
    const expiresIn = process.env.JWT_SECRET_DURATION!;

    const options: SignOptions = {
        expiresIn: expiresIn as ms.StringValue
    };

    return jwt.sign({ id }, secret, options);
};

export const verifyJwt = (token: string) => {
    const secret = process.env.JWT_SECRET!;
    return jwt.verify(token, secret) as { id: string; type: string };
};
