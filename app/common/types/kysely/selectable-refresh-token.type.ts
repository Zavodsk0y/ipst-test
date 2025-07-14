import { Selectable } from "kysely";
import { RefreshTokens } from "./db.type";

export type RefreshTokenType = Selectable<RefreshTokens>;
