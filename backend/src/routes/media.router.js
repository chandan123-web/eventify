import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {
  getMediaByEvent,
  uploadMedia,
  deleteMedia
} from "../controller/media.controller.js";

const router = express.Router();

// Get all media for a specific event
router.get("/:eventId", verifyJWT, getMediaByEvent);

// ✅ Upload both photo & video for a specific event
router.post(
  "/upload/:eventId",
  verifyJWT,
  upload.array("files", 10), // up to 10 files, any allowed type
  uploadMedia
);

// Delete media
router.delete("/:mediaId", verifyJWT, deleteMedia);

export default router;
