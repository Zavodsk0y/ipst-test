import { sqlCon } from "@common/config/kysely-config";
import { JwtTypes } from "@common/enum/jwt-types";
import { UserRoleEnum } from "@common/types/kysely/db.type";
import { RefreshTokenType } from "@common/types/kysely/selectable-refresh-token.type";
import { generateJwt } from "@shared/utils/jwt-utils";
import * as refreshTokenRepository from "../repository.token";

export async function makeTokens(userId: string, role: UserRoleEnum, session?: RefreshTokenType) {
    const accessToken = generateJwt(userId, JwtTypes.ACCESS, role);
    const refreshToken = generateJwt(userId, JwtTypes.REFRESH, role);

    if (session) {
        await refreshTokenRepository.updateRefreshToken(sqlCon, session.id, refreshToken);
    } else {
        await refreshTokenRepository.insert(sqlCon, {
            refresh_token: refreshToken,
            user_id: userId
        });
    }

    return { accessToken, refreshToken };
}
