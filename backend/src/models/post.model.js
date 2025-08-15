import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String, trim: true },
    newsText: { type: String, trim: true },
    media: [
      {
        url: { type: String, required: true }, // Cloudinary file URL
        type: { type: String, enum: ["image", "video"], required: true }, // file type
        public_id: { type: String }, // Cloudinary public_id for deletion
      }
    ]
  },
  { timestamps: true } // This adds createdAt and updatedAt automatically
);

export const Post = mongoose.model("Post", postSchema);
