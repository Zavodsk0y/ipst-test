import { IHandlingResponseError } from "../config/http-response";
import { HandlingErrorType } from "../enum/error-types";

export class AccessDeniedException extends Error {
    details: IHandlingResponseError;

    constructor(message?: string) {
        super(message);

        this.details = {
            type: HandlingErrorType.Allowed,
            property: "role",
            message: message ? message : "Access denied"
        };
    }
}
