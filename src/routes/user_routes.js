import { Router } from "express";
import { upload } from "../middleware/multer_middleware.js";
import { login, logoutUser, updatePassword } from "../controllers/auth_user_controller.js";
import { sign_up } from "../controllers/auth_user_controller.js";
import {verifyJWT} from "../middleware/auth_middleware.js";

const router = Router()

router.route("/sign-up").post(upload.single('profilepic'),sign_up)
router.route("/login").post(login)
router.route("/change-password").post(verifyJWT,updatePassword)
router.route("/logout").post(verifyJWT,logoutUser)
export default router