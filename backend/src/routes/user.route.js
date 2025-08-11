import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    updateUserCoverImage,
    changeCurrentPassword,
    
} from "../controller/user.controller.js";
import { getAllUsers } from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/register").post(
    upload.single("coverImage"),
    registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").post( verifyJWT,logoutUser);
router.route("/update-cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
router.route("/change-password").patch(verifyJWT, changeCurrentPassword);
router.get("/getAllUsers", verifyJWT, getAllUsers);
router.get("/getAllUsers", verifyJWT, getAllUsers);

router.get("/me", verifyJWT, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

export default router;
