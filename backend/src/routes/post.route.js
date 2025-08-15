// routes/post.routes.js
import express from "express";
import { createPost, getMyPosts, getUserProfileWithPosts,getRecentPostsOfFriends} from "../controller/post.controller.js";
import { verifyJWT as authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, upload.array("media", 5), createPost); // Allow up to 5 files
router.get("/my", authMiddleware, getMyPosts);
router.get("/user/:id", getUserProfileWithPosts);
router.post("/friends", authMiddleware, getRecentPostsOfFriends); 

export default router;