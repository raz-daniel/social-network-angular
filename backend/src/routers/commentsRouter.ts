import { Router } from "express";
import { createComment, deleteComment } from "../controllers/comments/controller";
import validation from "../middlewares/validation";
import { deleteCommentParamsValidator, newCommentParamsValidator, newCommentValidator } from "../controllers/comments/validators";
import paramsValidation from "../middlewares/param-validation";

const commentsRouter = Router()

commentsRouter.post('/:postId',
    validation(newCommentValidator),
    paramsValidation(newCommentParamsValidator),
    createComment
)
commentsRouter.delete('/:postId/:commentId',paramsValidation(deleteCommentParamsValidator), deleteComment)

export default commentsRouter