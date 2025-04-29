import { Request, Response, NextFunction } from 'express'
import AppError from '../../errors/app-error'
import { StatusCodes } from 'http-status-codes'

export default function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.userId) return next(new AppError(StatusCodes.UNAUTHORIZED, 'Authentication Error'))
    next()
}