import { BaseError } from "./BaseError";

/**
 * Represents a Forbidden Error.
 * This error is thrown when a user is not authorized to access a resource.
 */
export class ForbiddenError extends BaseError {
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}