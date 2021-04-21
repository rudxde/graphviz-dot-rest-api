import { RequestHandler } from "express";
import { getEnvironment } from './envrionment';
import { ApiError } from './error';

const SECOND = 1000;

class ToManyRequestsError extends ApiError {
    statusCode = 429;
    publicMessage = "The rate limiter limit was hit!";
    constructor(requestCounter: number, limit: number) {
        super(`The rate limiter limit of ${limit} requests/second was hit with ${requestCounter} requests/second.`);
    }
}

export function RateLimiter(): RequestHandler {
    let requestCounter = 0;
    setInterval(() => {
        requestCounter = 0;
    }, SECOND);
    const rateLimit = getEnvironment().rateLimit;
    if (!rateLimit) {
        return (req, res, next) => next();
    }
    return (req, res, next) => {
        if (requestCounter > rateLimit) {
            next(new ToManyRequestsError(requestCounter, rateLimit))
        }
        requestCounter++;
        next();
    }
}
