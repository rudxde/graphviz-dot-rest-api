import express, { Request, Response, NextFunction } from 'express';
import { getEnvironment, loadEnvironment } from './envrionment';
import { ApiError } from './error';
import { RateLimiter } from './rate-limiter';
import { getRoutes } from './route';


async function main(): Promise<void> {
    await loadEnvironment();

    const app = express();
    app.use(express.raw({ limit: getEnvironment().bodyLimit }));

    app.use(RateLimiter());

    app.use(getRoutes());

    app.use((err: ApiError | any, req: Request, res: Response, next: NextFunction) => {
        if (((err: ApiError | any): err is ApiError => err.statusCode)(err)) {
            const is400 = err.statusCode < 500 && err.statusCode >= 400;
            if (!is400 || getEnvironment().log4xxErrors) {
                console.error(err);
            }
            return res.status(err.statusCode).send(err.publicMessage || "");
        }
        console.error(err);
        res.sendStatus(500);
        next();
    });

    app.listen(getEnvironment().port, getEnvironment().hostName, () =>
        console.log(`Server listening on hostname ${getEnvironment().hostName} and port ${getEnvironment().port}!`),
    );
}

main()
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
