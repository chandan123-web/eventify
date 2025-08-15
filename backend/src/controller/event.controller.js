import Event from "../models/event.model.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // ✅ You need to implement this

// Create Event
const createEvent = async (req, res) => {
  try {
    const { name, description, date, isPublic, invitedUsers } = req.body;

    // Convert emails to ObjectIds
    let invitedUserIds = [];
    if (Array.isArray(invitedUsers) && invitedUsers.length > 0) {
      const foundUsers = await User.find({
        email: { $in: invitedUsers }
      }).select("_id");
      invitedUserIds = foundUsers.map(user => user._id);
    }

    // Handle cover image upload if provided
    let coverImageUrl = "";
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      coverImageUrl = uploadResult?.secure_url || "";
    }

    const event = await Event.create({
      name,
      description,
      date,
      ownerId: req.user.id, // from verifyJWT middleware
      isPublic,
      invitedUsers: invitedUserIds,
      coverImage: coverImageUrl
    });

    res.status(201).json({
      message: "Event created successfully",
      data: event
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single Event
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("ownerId", "name email")
      .lean();

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Event
const updateEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const event = await Event.findById(id);
  if (!event) {
    return res.status(404).json({ message: "Event not found." });
  }
  if (event.ownerId.toString() !== userId) {
    return res.status(403).json({ message: "Unauthorized." });
  }

  // Update text fields
  event.name = req.body.name || event.name;
  event.description = req.body.description || event.description;
  event.date = req.body.date || event.date;
  event.isPublic = typeof req.body.isPublic !== "undefined" ? req.body.isPublic : event.isPublic;

  // Handle new cover image if uploaded
  if (req.file) {
    const uploadResult = await uploadOnCloudinary(req.file.path);
    event.coverImage = uploadResult?.secure_url || event.coverImage;
  }

  await event.save();
  res.json({
    message: "Event updated successfully",
    data: event
  });
};

// Delete Event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully."
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get All Events
const getAllEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const queryObj = {
      $or: [
        { ownerId: userId },
        { invitedUsers: userId }
      ]
    };

    if (req.query.name) {
      queryObj.name = { $regex: req.query.name, $options: "i" };
    }
    if (req.query.date) {
      queryObj.date = req.query.date;
    }

    let query = Event.find(queryObj)
      .populate("ownerId", "name email")
      .lean();

    if (req.query.sort) {
      query = query.sort(req.query.sort.split(",").join(" "));
    } else {
      query = query.sort("-createdAt");
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const events = await query;

    res.json({
      results: events.length,
      page,
      events,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove invitee from Event
const removeInviteeFromEvent = async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    const ownerId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }
    if (event.ownerId.toString() !== ownerId) {
      return res.status(403).json({ message: "Only the owner can remove invitees." });
    }
    if (!event.invitedUsers.includes(userId)) {
      return res.status(404).json({ message: "User not invited to this event." });
    }

    event.invitedUsers = event.invitedUsers.filter(
      (id) => id.toString() !== userId
    );
    await event.save();

    res.status(200).json({
      message: "User removed from event successfully.",
      event,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  removeInviteeFromEvent
};
