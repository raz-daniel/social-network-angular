import { NextFunction, Response, Request } from "express";
import { createHmac } from "crypto";
import config from 'config'
import { sign } from "jsonwebtoken";
import AppError from "../../errors/app-error";
import { StatusCodes } from "http-status-codes";
import { UserModel } from "../../model/user";

export function hashPassword(password: string): string {
    return createHmac('sha256', config.get<string>('app.secret'))
        .update(password)
        .digest('hex')
}

export async function login(req: Request<{}, {}, { username: string, password: string }>, res: Response, next: NextFunction) {
    const { username, password } = req.body
    try {
        const user = await UserModel.findOne({
            username,
            password: hashPassword(password),
        })

        const jwt = sign(user.toObject(), config.get<string>('app.jwtSecret'))
        console.log('jwt:', jwt)
        if (!jwt) {
            return next(new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to generate Authentication token'))
        }

        res.status(StatusCodes.CREATED).json({ jwt })

    } catch (err) {
        console.error('Login Error:', err)
        next(new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Authentication Failed'))
    }
}

export async function signup(req: Request<{}, {}, {
    username: string, password: string,
    name: string
}>, res: Response, next: NextFunction) {
    const { username, password, name } = req.body
    try {
        const user = new UserModel({
            name,
            username,
            password: hashPassword(password),
            createdAt: new Date(),
            following: []
        })

        await user.save()


        const jwt = sign(user.toObject(), config.get<string>('app.jwtSecret'))
        console.log('jwt:', jwt)
        if (!jwt) {
            return next(new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to generate Authentication token'))
        }

        res.status(StatusCodes.CREATED).json({ jwt })



    } catch (err) {
        console.error('Signup Failed:', err)
        next(new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to Create Account'))
    }
}