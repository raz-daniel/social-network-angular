import { NextFunction, Request, Response } from "express";
import AppError from "../../errors/app-error";
import { StatusCodes } from "http-status-codes";
import { UserModel } from "../../model/user";
import { PostModel } from "../../model/post";
// import sequelize from "../../db/sequelize";


export async function getFeed(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.userId
        console.log('userId:', userId)
        if (!userId) {
            return next(new AppError(StatusCodes.UNAUTHORIZED, 'Authentication Required'))
        }

        const user = await UserModel.findById(userId)
        const feed = await PostModel.find({
            userId: {
                $in: user.following
            }
        })
        // const user = await User.findByPk(userId, {
        //     include: [{
        //         model: User,
        //         as: 'following',
        //         include: [ {
        //             model: Post,
        //             ...postIncludes
        //         } ]
        //     }]
        // })
        // console.log('user:', user)
        // if (!user) {
        //     return next(new AppError(StatusCodes.NOT_FOUND, 'User not found!'))
        // }

        // const feed = user.following.reduce((cum: Post[], {posts}) => {
        //     return [...cum, ...posts]
        // }, [])
        // .sort((a: Post, b: Post) => a.createdAt < b.createdAt ? 1 : -1)
        // console.log('feed:', feed)

        res.status(StatusCodes.OK).json(feed.map(post => post.toObject()))

    } catch (err) {
        console.error('Feed Error:', err)
        next(new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to retrieve feed'))
    }
}