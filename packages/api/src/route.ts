import { Router } from 'express';
import { Dot } from './dot';

export function getRoutes(): Router {
    const router = Router();

    router.put("/svg", (req, res, next) => {
        res.setHeader("Content-Type", "image/svg+xml");
        Dot.getInstance().generateSvg(res, req.body)
            .then(() => res.status(200).end())
            .catch(next);
    });

    router.put("/png", (req, res, next) => {
        res.setHeader("Content-Type", "image/png");
        Dot.getInstance().generatePng(res, req.body)
            .then(() => res.status(200).end())
            .catch(next);
    });

    return router;
}
