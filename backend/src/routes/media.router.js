import { Router } from "express";
import {
  uploadMedia,
  approveMedia,
  updateMedia,
  deleteMedia,
} from "../controller/media.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();
router.use(verifyJWT)

router.post(
  "/upload",
  upload.single("file"),
  uploadMedia
);

 router.put(
   "/approve/:id",
    approveMedia
 );

router.put(
  "/:id",
  updateMedia
);

router.delete(
  "/:id",
  deleteMedia
);

export default router;