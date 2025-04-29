import { Router } from "express";
import { createPost, deletePost, getPost, getProfile, updatePost } from "../controllers/profile/controller";
import validation from "../middlewares/validation";
import { newPostFilesValidator, newPostValidator, updatePostValidator } from "../controllers/profile/validator";
import fileValidation from "../middlewares/file-validation";
import fileUploader from "../middlewares/file-uploader";

const profileRouter = Router()

profileRouter.get('/', getProfile)
profileRouter.get('/:id', getPost)
profileRouter.delete('/:id', deletePost)
profileRouter.post('/', validation(newPostValidator), fileValidation(newPostFilesValidator), fileUploader , createPost)
profileRouter.patch('/:id', validation(updatePostValidator), updatePost)

export default profileRouter