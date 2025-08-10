import {Event} from "../models/event.model.js";
import mongoose from "mongoose";

 const createEvent = async (req, res) => {
  try {
    const newEvent = await Event.create({
      name: req.body.name,
      description: req.body.description,
      ownerId: req.user.id,
      isPublic: req.body.isPublic || false,
      date: req.body.date,
      invitedUsers: req.body.invitedUsers || [],
      
    });

    res.status(201).json({
      message: "Event created successfully.",
      data: newEvent,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};






   const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
                   .populate("ownerId", "name email") // only get name & email
                    .lean(); // optional: convert to plain JS objects


    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const updateEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // assuming JWT auth middleware

  const event = await Event.findById(id);

  if (!event) {
    return res.status(404).json({ message: "Event not found." });
  }

  if (event.ownerId.toString() !== userId) {
    return res.status(403).json({ message: "Unauthorized." });
  }

  // Proceed to update
  event.name = req.body.name || event.name;
  event.description = req.body.description || event.description;
  await event.save();

  res.json(event);
};

 const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }};

const getAllEvents = async (req, res) => {
  try {
    const userId = req.user.id;

    const queryObj = {
      $or: [
        { ownerId: userId },
        { invitedUsers: userId }
      ]
    };

    // --- Filtering ---
    if (req.query.name) {
      queryObj.name = { $regex: req.query.name, $options: "i" };
    }

    if (req.query.date) {
      queryObj.date = req.query.date;
    }

    // --- Query the DB ---
    let query = Event.find(queryObj);

    // --- Sorting ---
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // --- Pagination ---
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


const removeInviteeFromEvent = async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    const ownerId = req.user.id; // from JWT middleware

    // Find the event
    const event = await Event.findById(eventId);

    if (!event) {
      return res
        .status(404)
        .json({ message: "Event not found." });
    }

    // Check if current user is the owner
    if (event.ownerId.toString() !== ownerId) {
      return res
        .status(403)
        .json({ message: "Only the owner can remove invitees." });
    }

    // Check if user is actually invited
    if (!event.invitedUsers.includes(userId)) {
      return res
        .status(404)
        .json({ message: "User not invited to this event." });
    }

    // Remove the user
    event.invitedUsers = event.invitedUsers.filter(
      (id) => id.toString() !== userId
    );

    await event.save();

    res.status(200).json({
      message: "User removed from event successfully.",
      event,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};



  export {
    createEvent,
    getEvent,
    updateEvent,
    deleteEvent,
    getAllEvents,
    removeInviteeFromEvent

  }