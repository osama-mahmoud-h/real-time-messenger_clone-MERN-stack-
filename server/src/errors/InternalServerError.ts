import { BaseError } from "./BaseError";

/**
 * Represents an internal server error.
 * Inherits from the BaseError class.
 */
export class InternalServerError extends BaseError {
    /**
     * Creates a new instance of InternalServerError.
     * @param message - The error message.
     */
    constructor(message = 'Internal Server Error') {
        super(message, 500);
    }
}