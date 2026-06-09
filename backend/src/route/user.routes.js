import {Router} from "express";
import {loginUser, registerUser ,logoutUser} from '../controller/user.controller.js';
import {upload} from "../middleware/multer.middleware.js";
import {authenticateUser} from "../middleware/auth.middleware.js";
import {refreshAccessToken} from '../controller/user.controller.js';


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
router.route("/logout").post(authenticateUser,logoutUser)
router.route("/refreshtoken").post(refreshAccessToken)

export default router;