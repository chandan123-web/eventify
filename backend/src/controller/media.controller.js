import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Media } from "../models/media.model.js";
import path from "path";
import { User } from "../models/user.model.js";

const uploadMedia = async (req, res) => {
     const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded." });
    }
   const localFilePath = file.path;
   // localFilePath = localFilePath.replace(/\\/g, "/");
  console.log("Fixed local file path →", localFilePath);

    try {
        
        const cloudinaryResponse = await uploadOnCloudinary(localFilePath);
        if (!cloudinaryResponse) {
          console.log("cloudinaryResponse →", cloudinaryResponse);
            return res.status(500).json({ message: "Failed to upload file to Cloudinary." });
        }

        const newMedia = await Media.create({
          eventId: req.body.eventId,
          uploaderId: req.user.id,
          file: cloudinaryResponse.secure_url,
          tags: req.body.tags?.split(",") || [],
          uploadDate: new Date(),
          isApproved: false,
        });
   
        res.status(201).json({
            message: "Media uploaded successfully.",
            data: newMedia,
        });
}

    catch (error) {
        console.error("Error uploading media:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

const approveMedia = async (req, res) => {
  try {
    const mediaId = req.params.id;

    const media = await Media.findById(mediaId);
    if (!media) {
      return res.status(404).json({ message: "Media not found." });
    }

    media.isApproved = true;
    await media.save();

    res.json({ message: "Media approved successfully.", data: media });
  } catch (error) {
    console.error("Error approving media:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const updateMedia = async (req, res) => {
  try {
    const mediaId = req.params.id;

    let media = await Media.findById(mediaId);
    if (!media) {
      return res.status(404).json({ message: "Media not found." });
    }

    // Check permissions:
    // Only uploader or admin can update
    if (
      media.uploaderId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this media." });
    }

    // Update allowed fields

    media.tags = req.body.tags
      ? req.body.tags.split(",").map((tag) => tag.trim())
      : media.tags;
    

    await media.save();

    res.json({
      message: "Media updated successfully.",
      data: media,
    });
  } catch (error) {
    console.error("Error updating media:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const deleteMedia = async (req, res) => {
  try {
    const mediaId = req.params.id;

    const media = await Media.findById(mediaId);
    if (!media) {
      return res.status(404).json({ message: "Media not found." });
    }

    // Check permissions:
    if (
      media.uploaderId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this media." });
    }

    // Delete from Cloudinary
    if (media.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(media.cloudinaryPublicId, {
        resource_type: "auto",
      });
    }

   

     //soft delete:
     media.isDeleted = true;
     await media.save();

    res.json({
      message: "Media deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting media:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const getallmedia = async (req, res) => {
  
  const {page = 1, limit = 10,query ,sortBy = "uploadDate", sortOrder = "desc",sortType = "date",eventId}= req.query;

    
}
const myMedia = async (req, res) => {
  try {
    const userId = req.user.id;
    const media = await Media.find({ uploaderId: userId })
      .populate("eventId", "name")
      .sort({ uploadDate: -1 });

    res.json({
      message: "User media fetched successfully.",
      data: media,
    });
  } catch (error) {
    console.error("Error fetching user media:", error);
    return res.status(500).json({ message: "Internal server error." });
  }

}
    


export {
  uploadMedia,
  approveMedia,
  updateMedia,
  deleteMedia,
};

