import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js"; // ✅ for file uploads

import {
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  removeInviteeFromEvent,
} from "../controller/event.controller.js";

const router = Router();

// Get all events
router.get("/getAllEvents", verifyJWT, getAllEvents);

// Create event (with optional cover image upload)
router.post(
  "/createEvent",
  verifyJWT,
  upload.single("coverImage"), // accepts a single file for coverImage
  createEvent
);

// Get single event
router.get("/:id", verifyJWT, getEvent);

// Update event (with optional new cover image upload)
router.patch(
  "/:id",
  verifyJWT,
  upload.single("coverImage"),
  updateEvent
);

// Delete event
router.delete("/:id", verifyJWT, deleteEvent);

// Remove invitee
router.delete("/remove-invitee/:eventId/:userId", removeInviteeFromEvent);

export default router;
