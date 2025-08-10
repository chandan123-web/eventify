import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";

import {
     createEvent,
    getEvent,
    updateEvent,
    deleteEvent,
    getAllEvents,
    removeInviteeFromEvent


} from "../controller/event.controller.js";


const router = Router();
router.use(verifyJWT);



router.post("/", createEvent);
router.get("/:id", getEvent);
router.patch("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.get("/", getAllEvents);
router.delete("/remove-invitee/:eventId/:userId", removeInviteeFromEvent);

export default router ;