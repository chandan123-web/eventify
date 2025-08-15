import mongoose, { Schema } from "mongoose";

const eventschema = new Schema(
  {
    name: {
      type: String,
      required: true,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      required: true,
      default: "",
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    invitedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // 🆕 Cover image or video URL
    coverImage: {
      type: String, // store Cloudinary URL or other hosted URL
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventschema);
export default Event;
