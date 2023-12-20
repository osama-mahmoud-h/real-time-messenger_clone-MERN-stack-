import { BaseError } from "./BaseError";

/**
 * Represents a BadRequestError.
 * This error is thrown when a bad request is made.
 */
export class BadRequestError extends BaseError {
    /**
     * Creates a new instance of BadRequestError.
     * @param message - The error message.
     */
    constructor(message = 'Bad Request') {
        super(message, 400);
    }
}