/**
 * Represents a base error class that extends the built-in Error class.
 */
export class BaseError extends Error {
    /**
     * The HTTP status code associated with the error.
     */
    public readonly statusCode: number;

    /**
     * Creates a new instance of the BaseError class.
     * @param message The error message.
     * @param statusCode The HTTP status code associated with the error.
     */
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}