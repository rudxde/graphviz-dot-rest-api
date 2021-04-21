export abstract class ApiError extends Error {
    abstract statusCode: number;
    publicMessage?: string;
}

export class BadRequestError extends ApiError {
    statusCode = 400;
    constructor() {
        super("Bad Request");
    }
}
