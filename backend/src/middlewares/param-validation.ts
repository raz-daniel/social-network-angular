import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import AppError from "../errors/app-error";
import { StatusCodes } from "http-status-codes";

export default function paramsValidation(validator: ObjectSchema) {

    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            req.params = await validator.validateAsync(req.params) //the first req.body is for transformation and not validation
            next()
        } catch (error) {
            console.error('paramsValidation Error:', error)
            const message = error.details && error.details.length > 0 ? error.details[0].message : error.message

            next(new AppError(StatusCodes.BAD_REQUEST, message))
        }
    }
}