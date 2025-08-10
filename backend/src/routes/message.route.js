import {Router} from "express";
import {
    deleteMessage,
    createMessage,
    getMessagesByEvent
} from "../controller/guestmessage.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/", createMessage);
router.get("/:eventId", getMessagesByEvent);
router.delete("/:id", deleteMessage);

export default router;
