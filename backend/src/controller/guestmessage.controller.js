import {GuestMessage} from "../models/guestbookMessage.model.js";
import mongoose from "mongoose";



const createMessage = async (req, res) => {
  try {
    const { eventId, message } = req.body;

    const newMessage = await GuestMessage.create({
      eventId,
      userId: req.user.id,
      message,
    });

    // emit the new message via socket.io
    req.io.to(eventId).emit("new_message", newMessage);

    res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
const getMessagesByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const messages = await GuestMessage.find({ eventId })
      .populate("userId", "name email") // show user info
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await GuestMessage.findById(id);
    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    // check ownership
    if (message.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this message." });
    }

    await message.deleteOne();

    res.json({ success: true, message: "Message deleted." });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export { deleteMessage ,getMessagesByEvent, createMessage };

