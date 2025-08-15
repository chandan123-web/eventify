import { Post } from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createPost = async (req, res) => {
  try {
    const mediaFiles = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const result = await uploadOnCloudinary(file.path);
        if (result) {
          mediaFiles.push({
            url: result.secure_url,
            type: result.resource_type, // "image" or "video"
            public_id: result.public_id
          });
        }
      }
    }

    const newPost = await Post.create({
      userId: req.user.id,
      location: req.body.location,
      newsText: req.body.newsText,
      media: mediaFiles
    });

    res.status(201).json({ success: true, post: newPost });
  } catch (err) {
    console.error("Post creation error:", err);
    res.status(500).json({ success: false, message: "Failed to create post" });
  }
};

import { User } from "../models/user.model.js";

// GET my posts
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (err) {
    console.error("❌ Error fetching my posts:", err);
    res.status(500).json({ success: false, message: "Failed to fetch posts" });
  }
};

// GET another user's profile + posts
export const getUserProfileWithPosts = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select("name email profileImage bio");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const posts = await Post.find({ userId: id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      user,
      count: posts.length,
      posts
    });
  } catch (err) {
    console.error("❌ Error fetching profile:", err);
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};

export const getRecentPostsOfFriends = async (req, res) => {
  try {
    const friendIds = req.body.friendIds || []; // ✅ Now reading from POST body

    if (!friendIds.length) {
      return res.status(400).json({ message: "No friend IDs provided" });
    }

    const posts = await Post.find({ userId: { $in: friendIds } })
      .populate("userId", "name profileImage")
      .sort({ createdAt: -1 })
      .limit(20);

    const formattedPosts = posts.map((post) => ({
  _id: post._id,
  userId: post.userId._id,
  userName: post.userId.name,
  userProfileImage: post.userId.coverImage || "https://thumbs.dreamstime.com/z/nature-selfie-friends-mountain-hiking-adventure-natural-environment-canada-people-trekking-photography-outdoor-memory-320158080.jpg?w=992",
  newsText: post.newsText,
  media: post.media.map(m => m.url), // ✅ Only URLs now
  location: post.location,
  createdAt: post.createdAt
}));


    res.json({ posts: formattedPosts });
  } catch (error) {
    console.error("Error fetching friends' posts:", error);
    res.status(500).json({ message: "Server error" });
  }
};
