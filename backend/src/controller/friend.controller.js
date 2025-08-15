import mongoose from "mongoose";
import Event from "../models/event.model.js";

export const getAllUniqueFriendIds = async (req, res) => {
  try {
    const objectUserId = new mongoose.Types.ObjectId(req.user.id);

    // 1️⃣ Find events where I'm owner or invited
    const events = await Event.find({
      $or: [
        { ownerId: objectUserId },
        { invitedUsers: objectUserId }
      ]
    }).select("ownerId invitedUsers");

    // 2️⃣ Collect all user IDs from these events
    let allUserIds = [];
    events.forEach(event => {
      allUserIds.push(event.ownerId, ...event.invitedUsers);
    });

    // 3️⃣ Remove my own ID and duplicates
    const uniqueFriendIds = [
      ...new Set(allUserIds.filter(id => !id.equals(objectUserId)).map(id => id.toString()))
    ];

    // 4️⃣ Return only IDs
    res.status(200).json({
      success: true,
      count: uniqueFriendIds.length,
      friendIds: uniqueFriendIds
    });

  } catch (error) {
    console.error("Error fetching friend IDs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get friend IDs"
    });
  }
}; 