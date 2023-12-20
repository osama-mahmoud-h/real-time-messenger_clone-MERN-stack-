import { BaseError } from "./BaseError";

export class NotFoundError extends BaseError {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}
