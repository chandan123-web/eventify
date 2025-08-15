// src/pages/FriendsFeed.jsx
import { useQuery } from "@tanstack/react-query";
import { getFriendIds, getRecentPostsOfFriends } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function FriendsFeed() {
  const navigate = useNavigate();
  const [fullImage, setFullImage] = useState(null);

  // Step 1: Fetch friend IDs
  const { data: friendData, isLoading: loadingFriends } = useQuery({
    queryKey: ["friendIds"],
    queryFn: getFriendIds,
  });

  const friendIds = friendData?.friendIds || [];

  // Step 2: Fetch their posts
  const { data: posts, isLoading: loadingPosts } = useQuery({
    queryKey: ["friendsPosts", friendIds],
    queryFn: () => getRecentPostsOfFriends(friendIds),
    enabled: !!friendIds.length,
  });

  if (loadingFriends || loadingPosts) {
    return <p className="text-center py-4">Loading feed...</p>;
  }

  if (!posts?.length) {
    return <p className="text-center py-4">No recent posts from friends.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white shadow rounded-lg p-4 mb-4"
        >
          {/* User info */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate(`/profile/${post.userId}`)}
          >
            <img
              src={post.userProfileImage || "/default-avatar.png"}
              alt={post.userName}
              className="w-12 h-12 rounded-full mr-3"
            />
            <div>
              <h2 className="font-semibold">{post.userName}</h2>
              <p className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Post text */}
          {post.newsText?.trim() && (
            <p className="mt-3 text-gray-800">{post.newsText}</p>
          )}

          {/* Post image — only if valid */}
          {post.media?.length > 0 &&
            post.media[0] &&
            typeof post.media[0] === "string" &&
            post.media[0].trim() !== "" && (
              <img
                src={post.media[0]}
                alt="Post"
                className="mt-3 rounded-lg border object-cover max-h-96 w-full cursor-pointer hover:opacity-90"
                onClick={() => setFullImage(post.media[0])}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}

          {/* File link — only if valid */}
          {post.file &&
            typeof post.file === "string" &&
            post.file.trim() !== "" && (
              <a
                href={post.file}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-3 text-blue-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                📄 View Attached File
              </a>
            )}

          {/* Location */}
          {post.location && (
            <p className="text-sm text-gray-500 mt-2">📍 {post.location}</p>
          )}
        </div>
      ))}

      {/* Full screen image view */}
      {fullImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setFullImage(null)}
        >
          <img
            src={fullImage}
            alt="Full view"
            className="max-w-full max-h-full rounded-lg"
          />
        </div>
      )}
    </div>
  );
} 