import {Router} from "express";
import {loginUser, registerUser ,logoutUser} from '../controller/user.controller.js';
import {upload} from "../middleware/multer.middleware.js";
import {authenticateUser} from "../middleware/auth.middleware.js";
const router = Router();
router.route("/register").post(
    upload.fields([
       {
        name: "avatar",
        maxCount: 1,
       },
       {
        name: "coverImage",
        maxCount:1,
       }

    ]),
    registerUser
)
router.route("/login").post(loginUser);
// secure
router.route("/logoutUser").post(authenticateUser,logoutUser)

export default router;