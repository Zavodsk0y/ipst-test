import { generateJwt } from "../../shared/utils/jwt-utils";

export async function makeToken(userId: string) {
    return generateJwt(userId);
}
