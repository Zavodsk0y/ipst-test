import { IHandlingResponseError } from "../config/http-response";
import { HandlingErrorType } from "../enum/error-types";

export class NotFoundException extends Error {
    details: IHandlingResponseError;

    constructor(message?: string) {
        super(message);

        this.details = {
            type: HandlingErrorType.Found,
            property: "id",
            message: message ? message : "Not found"
        };
    }
}
