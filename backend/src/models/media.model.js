import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  file: { type: String, required: true },
  tags: { type: [String], default: [] },
  uploadDate: { type: Date, default: Date.now },
  isApproved: { type: Boolean, default: false }
});

export default mongoose.model("Media", mediaSchema);
