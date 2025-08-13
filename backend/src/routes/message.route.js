// message.route.js
import express from "express";
import { StreamChat } from "stream-chat";
import dotenv from "dotenv";
import { verifyJWT } from "../middleware/auth.middleware.js";
import Event from "../models/event.model.js";

dotenv.config();

if (!process.env.STREAM_API_KEY || !process.env.STREAM_API_SECRET) {
  console.error("❌ Missing Stream API credentials in .env");
  process.exit(1);
}

const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);

const router = express.Router();

// ✅ Generate Stream token
router.get("/token", verifyJWT, async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user._id.toString();
    const token = serverClient.createToken(userId);

    res.json({ token, userId });
  } catch (err) {
    console.error("Error generating token:", err);
    res.status(500).json({ error: err.message || "Failed to generate token" });
  }
});

// ✅ Create or join chat channel for event
router.post("/:eventId/channel", verifyJWT, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId).populate(
      "invitedUsers",
      "_id name"
    );

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (!event.ownerId) {
      return res.status(400).json({ error: "Event missing ownerId" });
    }

    const memberIds = [
      event.ownerId.toString(),
      ...event.invitedUsers.map((u) => u._id.toString()),
    ];

    const uniqueMemberIds = [...new Set(memberIds)];

    const channel = serverClient.channel("messaging", req.params.eventId, {
      name: event.name || `Event ${req.params.eventId}`,
      members: uniqueMemberIds,
      created_by_id: event.ownerId.toString(),
    });

    try {
      await channel.create();
      console.log(`✅ Channel created: ${req.params.eventId}`);
    } catch (err) {
      if (err.code === 4) {
        console.warn(`⚠ Channel ${req.params.eventId} already exists, joining instead.`);
        await channel.watch();
      } else {
        console.error("💥 Error creating channel:", err);
        throw err;
      }
    }

    res.json({ success: true, members: uniqueMemberIds });
  } catch (error) {
    console.error("Error creating/joining channel:", error);
    res.status(500).json({ error: error.message || "Failed to create/join channel" });
  }
});

export default router;
