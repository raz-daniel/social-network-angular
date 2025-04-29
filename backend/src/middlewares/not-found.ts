import { NextFunction, Request, Response } from "express";
import { StatusCodes } from 'http-status-codes';
import AppError from "../errors/app-error";


export default function notFound(req: Request, res: Response, next: NextFunction) {
    next(new AppError(StatusCodes.NOT_FOUND, 'Page Not Found'))
}