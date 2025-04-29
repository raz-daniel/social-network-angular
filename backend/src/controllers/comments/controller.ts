import { NextFunction, Response, Request } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/app-error";
import socket from "../../io/io";
import SocketMessages from "socket-enum-danielraz";
import { PostModel } from "../../model/post";


export async function deleteComment(req: Request<{ postId: string, commentId: string }>, res: Response, next: NextFunction) {
    try {
        const { postId, commentId } = req.params
        const post = await PostModel.findByIdAndUpdate(postId, {
            $pull: {
                comments: { _id: commentId }
            }
        }, {
            new: true
        })
        res.json(post.toObject())
    }
    catch (error) {
        next(error)
    }
}

export async function createComment(req: Request<{ postId: string }, {}, { body: string }>, res: Response, next: NextFunction) {
    try {

        const userId = req.userId
        console.log(userId)
        if (!userId) {
            return next(new AppError(StatusCodes.UNAUTHORIZED, 'Authentication Error'))
        }

        const { postId } = req.params
        console.log(postId)
        if (!postId) {
            return next(new AppError(StatusCodes.BAD_REQUEST, 'Missing Post ID'))
        }

        //mongodb vs js
        // const post = await PostModel.findById(postId)
        // post.comments.push({...req.body, userId, createdAt: new Date()})
        // await post.save()

        const post = await PostModel.findByIdAndUpdate(postId, {
            $push: {
                comments: { ...req.body, userId }
            }
        }, {
            new: true
        })

        console.log('Comment:', post)

        res.status(StatusCodes.CREATED).json(post.toObject())
        // socket.emit(SocketMessages.NEW_COMMENT, {from: req.headers['x-client-id'], data: comment})

    } catch (err) {
        console.error('Create Comment Error:', err)
        next(new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create new comment'))
    }
}

