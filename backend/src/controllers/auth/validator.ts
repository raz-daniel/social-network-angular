import Joi from "joi";
import { newPostFilesValidator } from "../profile/validator";

export const loginValidator = Joi.object({
    username: Joi.string().alphanum().min(6).max(40).required(),
    password: Joi.string().alphanum().min(6).max(40).required()
})

export const signupValidator = loginValidator.append({
    name: Joi.string().alphanum().min(3).max(40).required()
})

export const userPhotoFileValidator = newPostFilesValidator