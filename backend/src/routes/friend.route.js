import express from "express";
import { getAllUniqueFriendIds } from "../controller/friend.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/friends/ids - get only IDs of unique friends
router.get("/unique", verifyJWT, getAllUniqueFriendIds);

export default router;