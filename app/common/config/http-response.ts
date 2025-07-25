import type { HandlingErrorType } from "@common/enum/error-types";

export interface IHandlingResponseError {
    property?: string;
    type?: HandlingErrorType;
    message?: string;
}
