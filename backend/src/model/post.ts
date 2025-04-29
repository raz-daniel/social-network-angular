import mongoose from "../db/mongoose"
import { User } from "./user"

interface PostComment {
    body: string
    userId: string
    user: User
    createdAt: Date
}

interface Post {
    title: string
    body: string
    userId: string
    user: User
    comments: PostComment[]
    createdAt: Date
}

const CommentSchema = new mongoose.Schema<PostComment>({
    body: String,
    userId: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: Date
}, {
    toObject: {
        transform: function (doc, ret) {
            ret.id = ret._id
            delete ret._id
            delete ret.__v
        }

    }

})

const PostSchema = new mongoose.Schema<Post>({
    title: String,
    body: String,
    userId: String,
    user: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [CommentSchema],
    createdAt: Date

}, {
    toObject: {
        transform: function (doc, ret) {
            ret.id = ret._id
            delete ret._id
            delete ret.__v
        }

    }

})

export const PostModel = mongoose.model<Post>('Post', PostSchema, 'posts')