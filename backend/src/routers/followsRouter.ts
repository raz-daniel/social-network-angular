import { Router } from "express";
import { followUser, getFollowers, getFollowing, unfollowUser } from "../controllers/follows/controller";
import paramsValidation from "../middlewares/param-validation";
import { followValidator, unfollowValidator } from "../controllers/follows/validator";

const followRouter =  Router()

followRouter.get('/followers', getFollowers)
followRouter.get('/following', getFollowing)
followRouter.post('/follow/:id', paramsValidation(followValidator) ,followUser)
followRouter.post('/unfollow/:id', paramsValidation(unfollowValidator) ,unfollowUser)

export default followRouter