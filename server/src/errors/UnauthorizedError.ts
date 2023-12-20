import { BaseError } from "./BaseError";

/**
 * Represents an error that occurs when a user is unauthorized to perform a certain action.
 */
export class UnauthorizedError extends BaseError {
    /**
     * Creates a new instance of the UnauthorizedError class.
     * @param message The error message.
     */
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}