import Media from "../models/Media.model.js";
import Event from "../models/event.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

// ✅ Get all media for an event
export const getMediaByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // check if event exists
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

// ✅ Upload media for an event
export const uploadMedia = async (req, res) => {
  try {
    const files = req.files;
    const eventId =  req.params.eventId; // allow both body & params
    const tags = req.body.tags;

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded." });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    const uploadedMedia = await Promise.all(
      files.map(async (file) => {
        const localFilePath = file.path;

        try {
          const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

          if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); // remove temp file
          }

          if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
            throw new Error("Cloudinary upload failed");
          }

          return await Media.create({
            eventId,
            uploaderId: req.user._id,
            file: cloudinaryResponse.secure_url,
            tags: tags?.split(",").map((t) => t.trim()) || [],
            uploadDate: new Date(),
            isApproved: false,
          });
        } catch (err) {
          console.error(`Error processing file ${file.originalname}:`, err);
          return null; // skip failed file
        }
      })
    );

    const successfulUploads = uploadedMedia.filter(Boolean);

    res.status(201).json({
      success: true,
      message: `${successfulUploads.length} of ${files.length} files uploaded successfully.`,
      data: successfulUploads,
    });
  } catch (error) {
    console.error("Error uploading media:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// export const uploadMedia = async (req, res) => {
//   try {
//     const { eventId, tags } = req.body;

//     // 1. Check if eventId is provided
//     if (!eventId) {
//       return res.status(400).json({ message: "Event ID is required" });
//     }

//     // 2. Check if event exists
//     const event = await Event.findById(eventId);
//     if (!event) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     // 3. Check if files were uploaded
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ message: "No files uploaded" });
//     }

//     // 4. Save media to DB
//     const mediaDocs = req.files.map((file) => ({
//       event: eventId,
//       fileName: file.originalname,
//       filePath: file.path,
//       fileType: file.mimetype,
//       tags: tags ? tags.split(",") : []
//     }));

//     const savedMedia = await Media.insertMany(mediaDocs);

//     // 5. Send success response
//     return res.status(201).json({
//       message: "Media uploaded successfully",
//       media: savedMedia
//     });

//   } catch (error) {
//     console.error("Upload media error:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// ✅ Delete media
export const deleteMedia = async (req, res) => {
  try {
    const { mediaId } = req.params;

    const media = await Media.findById(mediaId);
    if (!media) {
      return res.status(404).json({ message: "Media not found." });
    }

    // Allow deletion only by uploader or admin
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
