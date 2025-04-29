import { NextFunction, Request, Response } from "express";
import AppError from "../../errors/app-error";
import config from 'config'
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export default function getUser(req: Request, res: Response, next: NextFunction) {
    
        console.log('Auth Header:', req.header('Authorization'))
        const authHeader =  req.header('Authorization')

        if (!authHeader) {
            return next(new AppError(StatusCodes.UNAUTHORIZED, 'Credential for authHeader is Missing or Invalid'))
            // return next()
        }

        const token = authHeader.replace('Bearer ', '')
        console.log('Token:', token)
        if (!token.trim()) {
            return next(new AppError(StatusCodes.UNAUTHORIZED, 'Token is missing'))
        }

        try {
            const decoded = jwt.verify(token, config.get<string>('app.jwtSecret')) as { id: string }
            console.log('Decoded Id:', decoded.id)
            if (!decoded.id) {
                return next(new AppError(StatusCodes.UNAUTHORIZED, 'User ID is missing from token'))
            }

            req.userId = decoded.id
            next()

        } catch (err) {

            console.log('JWT Verification Error:', err)
            next(new AppError(StatusCodes.UNAUTHORIZED, 'Invalid or expired token'))
        }

}