import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import AppError from "../errors/app-error";
import { StatusCodes } from "http-status-codes";

export default function fileValidation(validator: ObjectSchema) {

    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            req.files = await validator.validateAsync(req.files)
            next()
        } catch (error) {
            console.error('fileValidation Error:', error)
            const message = error.details && error.details.length > 0 ? error.details[0].message : error.message

            next(new AppError(StatusCodes.BAD_REQUEST, message))
        }
    }
}