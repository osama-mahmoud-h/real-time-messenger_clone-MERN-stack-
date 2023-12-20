import { BaseError } from "./BaseError";

/**
 * Represents a custom error class for a "Not Found" error.
 */
export class NotFoundError extends BaseError {
    /**
     * Creates a new instance of the NotFoundError class.
     * @param message The error message.
     */
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}
