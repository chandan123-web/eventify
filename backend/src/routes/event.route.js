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
// router.get("/ getAllEvents", getAllEvents);
router.get("/getAllEvents",verifyJWT, getAllEvents);
// router.use(verifyJWT);



router.post("/createEvent",verifyJWT, createEvent);
router.get("/:id",verifyJWT, getEvent);
router.patch("/:id", verifyJWT,updateEvent);
router.delete("/:id",verifyJWT, deleteEvent);
// router.get("/getAllEvents", getAllEvents);
router.delete("/remove-invitee/:eventId/:userId", removeInviteeFromEvent);

export default router ;