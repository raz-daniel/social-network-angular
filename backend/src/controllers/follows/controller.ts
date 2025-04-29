import { NextFunction, Response, Request } from "express";
import { col } from "sequelize";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/app-error";
import { UserModel } from "../../model/user";


export async function getFollowers(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.userId
        console.log('userId:', userId)
        if (!userId) {
            return next(new AppError(StatusCodes.UNAUTHORIZED, 'Authentication Required'))
        }

        const followers = await UserModel.find({
            following: {
                $in: userId
            }
        })
        // const user = await User.findByPk(userId, {
        //     include: [{
        //         model: User,
        //         as: 'followers'
        //     }],
        //     order: [[col('followers.name'), 'ASC']]
        // })
        // console.log('user:', user)
        // if (!user) {
        //     return next(new AppError(StatusCodes.NOT_FOUND, 'User not found!'))
        // }

        res.status(StatusCodes.OK).json(followers.map(user => user.toObject()))

    } catch (err) {
        // console.error('getFollowers Error:', err)
        // next(new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to retrieve followers'))
    }
}

export async function getFollowing(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.userId
        console.log('userId:', userId)
        if (!userId) {
            return next(new AppError(StatusCodes.UNAUTHORIZED, 'Authentication Required'))
        }

        const user = await UserModel.findById(userId)
        // const user = await User.findByPk(userId, {
        //     include: [{
        //         model: User,
        //         as: 'following'
        //     }]
        // })
        // console.log('user:', user)
        // if (!user) {
        //     return next(new AppError(StatusCodes.NOT_FOUND, 'User not found!'))
        // }

        res.status(StatusCodes.OK).json(user.following)
    } catch (err) {
        console.error('getFollowing Error:', err)
        next(new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to retrieve following'))
    }
}

export async function followUser(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.userId
        console.log('userId:', userId)
        if (!userId) {
            return next(new AppError(StatusCodes.UNAUTHORIZED, 'Authentication Required'))
        }


        if (!req.params.id) {
            return next(new AppError(StatusCodes.BAD_REQUEST, 'user ID is required'))
        }

        if (userId === req.params.id) {
            return next(new AppError(StatusCodes.BAD_REQUEST, 'Cannot Follow Yourself'))
        }
        //js version vs mongo version
        // const user = await UserModel.findById(userId)
        // user.following.push(req.params.id)
        // await user.save()

        const user = await UserModel.findOneAndUpdate({ _id: userId }, { $push: { following: req.params.id } }, { new: true })

        res.status(StatusCodes.CREATED).json(user.toObject())
    } catch (err) {
        console.error('follow user Error:', err)
        //     if (err.name = 'SequelizeUniqueConstraintError') {
        //         return next(new AppError(StatusCodes.CONFLICT, 'Already Following this user.'))
        //     }

        next(new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to follow user'))
        // }
    }
}

export async function unfollowUser(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.userId
        console.log('userId:', userId)
        if (!userId) {
            return next(new AppError(StatusCodes.UNAUTHORIZED, 'Authentication Required'))
        }



        if (!req.params.id) {
            return next(new AppError(StatusCodes.BAD_REQUEST, 'user ID is required'))
        }

        if (userId === req.params.id) {
            return next(new AppError(StatusCodes.BAD_REQUEST, 'Cannot Follow Yourself'))
        }
        //js version vs mongo version
        // const user = await UserModel.findById(userId)
        // user.following = user.following.filter(followId => followId !== req.params.id)
        // await user.save()

        const user = await UserModel.findOneAndUpdate({ _id: userId }, { $pull: { following: req.params.id } }, { new: true })

        res.status(StatusCodes.OK).json({ success: true })


    } catch (err) {
        console.error('unfollow Error:', err)
        next(new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to unfollow user'))
        // }
    }
}
