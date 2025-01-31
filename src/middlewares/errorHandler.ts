import { Request, Response, NextFunction } from "express";

export const unknownError = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err?.message);
    res.status(500).json({
        error: true,
        message: 'internal server error'
    })
}