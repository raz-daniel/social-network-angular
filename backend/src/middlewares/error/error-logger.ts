import { NextFunction, Request, Response } from "express";

export default function errorLogger(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error('Error Details:', {
        message: err.message,
        path: req.path,
        method: req.method
    })
    next(err)
}