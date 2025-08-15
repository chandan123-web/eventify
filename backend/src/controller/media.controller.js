import Media from "../models/media.model.js";
import Event from "../models/event.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

// ✅ Get all media for an event
export const getMediaByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    const mediaFiles = await Media.find({ eventId }).sort({ uploadDate: -1 });

    res.json({ success: true, data: mediaFiles });
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// ✅ Upload media for an event (photos & videos)
export const uploadMedia = async (req, res) => {
  try {
    const files = req.files;
    const { eventId } = req.params;
    const tags = req.body.tags ? req.body.tags.split(",").map((t) => t.trim()) : [];

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded." });
    }

    // ✅ Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    const uploadedMedia = await Promise.all(
      files.map(async (file) => {
        const localFilePath = file.path;
        try {
          const cloudinaryResponse = await uploadOnCloudinary(localFilePath, "auto"); // auto handles images/videos

          // Remove local temp file
          if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
          }

          if (!cloudinaryResponse?.secure_url) {
            throw new Error("Cloudinary upload failed");
          }

          return await Media.create({
            eventId,
            uploaderId: req.user._id,
            file: cloudinaryResponse.secure_url,
            fileType: cloudinaryResponse.resource_type, // "image" or "video"
            tags,
            uploadDate: new Date(),
            isApproved: false,
          });
        } catch (err) {
          console.error(`❌ Error uploading ${file.originalname}:`, err.message);
          return { error: file.originalname };
        }
      })
    );

    const successes = uploadedMedia.filter((m) => !m.error);
    const failures = uploadedMedia.filter((m) => m.error);

    res.status(201).json({
      success: true,
      message: `${successes.length} file(s) uploaded, ${failures.length} failed.`,
      uploaded: successes,
      failed: failures.map((f) => f.error),
    });

  } catch (error) {
    console.error("🔥 Upload error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// ✅ Delete media
export const deleteMedia = async (req, res) => {
  try {
    const { mediaId } = req.params;

    const media = await Media.findById(mediaId);
    if (!media) {
      return res.status(404).json({ message: "Media not found." });
    }

    // Only uploader or admin can delete
    if (media.uploaderId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this file." });
    }

    await Media.findByIdAndDelete(mediaId);

    res.json({ success: true, message: "Media deleted successfully." });
  } catch (error) {
    console.error("Error deleting media:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
