import { Router } from "express";
import validation from "../middlewares/validation";
import { loginValidator, signupValidator, userPhotoFileValidator } from "../controllers/auth/validator";
import { login, signup } from "../controllers/auth/controller";
import fileValidation from "../middlewares/file-validation";
import fileUploader from "../middlewares/file-uploader";

const authRouter = Router()

authRouter.post('/login', validation(loginValidator), login)
authRouter.post('/signup', validation(signupValidator), fileValidation(userPhotoFileValidator), fileUploader, signup)

export default authRouter