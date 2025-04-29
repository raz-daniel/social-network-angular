import { NextFunction, Response, Request } from "express";
import AppError from "../../errors/app-error";
import { StatusCodes } from "http-status-codes";
import socket from "../../io/io";
import SocketMessages from "socket-enum-danielraz";
import { PostModel } from "../../model/post";
import mongoose from "../../db/mongoose";

export async function getProfile(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.userId
        console.log('userId:', userId)
        if (!userId) {
            return next(new AppError(StatusCodes.UNAUTHORIZED, 'Authentication Required'))
        }


        const profile = await PostModel.find({ userId }).populate('user')
        
        res.status(StatusCodes.OK).json(profile.map(doc => doc.toObject()))

    } catch (err) {
        console.error('getProfile Error:', err)
        next(new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to retrieve profile posts'))

    }
}


export async function getPost(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        // console.log('req.param.id', req.params.id)
        // if (!req.params.id) {
        //     return next(new AppError(StatusCodes.BAD_REQUEST, 'cannot find post id'))
        // }

        const post = await PostModel.findById(req.params.id)
        console.log('post:', post)
        if (!post) {
            return next(new AppError(StatusCodes.NOT_FOUND, 'Post Not Found'))
        }

        res.status(StatusCodes.OK).json(post.toObject())

    } catch (err) {
        // console.error('getPost Error:', err)
        // next(new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to retrieve post'))
    }
}

export async function deletePost(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        // console.log('req.params.id:', req.params.id)
        // if (!req.params.id) {
        //     return next(new AppError(StatusCodes.BAD_REQUEST, 'cannot find post id'))
        // }

        const _id = req.params.id
        const deleteResponse = await PostModel.deleteOne({ _id })

        if (deleteResponse.deletedCount === 0) {
            return next(new AppError(StatusCodes.NOT_FOUND, 'Posts not found'))
        }

        res.status(StatusCodes.OK).json({ success: true })

    } catch (err) {
        console.error('Delete Post Error:', err)
        next(new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete post'))
    }
}

export async function createPost(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.userId
        // console.log('userId:', userId)
        // if (!userId) {
        //     return next(new AppError(StatusCodes.UNAUTHORIZED, 'Authentication Required'))
        // }

        let createParams = { ...req.body, userId, user: userId, createdAt: new Date() }

        // if (req.imageUrl) {
        //     const { imageUrl } = req
        //     createParams = {...createParams, imageUrl}
        // }
        const post = new PostModel(createParams)
        await post.save()
        // const post = await Post.create(createParams)
        // console.log('post:', post)

        // await post.reload(postIncludes)

        res.status(StatusCodes.CREATED).json(post.toObject())
        
        // socket.emit(SocketMessages.NEW_POST, {from: req.headers['x-client-id'], data: post})

    } catch (err) {
        console.error('Creating Post Error:', err)
        next(new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create post'))
    }

}

export async function updatePost(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
        const { title, body } = req.body
        // console.log(`title: ${title}, body:${body}`)
        // if (!title || !body) {
        //     return next(new AppError(StatusCodes.BAD_REQUEST, 'Title and Body are Required'))
        // }

        const post = await PostModel.findById(req.params.id)
        // console.log('post:', post)
        if (!post) {
            return next(new AppError(StatusCodes.NOT_FOUND, 'Post not found'))
        }

        if (post.title === title && post.body === body) {
            res.status(StatusCodes.NO_CONTENT).json({
                success: true,
                message: 'No changes needed'
            })
        }

        post.title = title
        post.body = body

        await post.save()

        res.status(StatusCodes.OK).json(post.toObject())

    } catch (err) {
        // console.error('Updating Post Error:', err)
        // next(new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update post'))
    }
}