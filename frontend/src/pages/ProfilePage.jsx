// src/pages/ProfilePage.jsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserProfileWithPosts } from "../lib/api.js";

export default function ProfilePage() {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userProfile", id],
    queryFn: () => getUserProfileWithPosts(id),
    enabled: !!id, // don't run until id exists
  });

  if (isLoading) return <p className="text-center py-4">Loading profile...</p>;
  if (isError) return <p className="text-center py-4">Failed to load profile.</p>;
  if (!data) return <p className="text-center py-4">User not found.</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6 bg-white shadow rounded-lg p-4">
        <img
          src={data.profile?.avatar || "/default-avatar.png"}
          alt={data.profile?.name || "User"}
          className="w-20 h-20 rounded-full object-cover"
          onError={(e) => { e.target.src = "/default-avatar.png"; }}
        />
        <div>
          <h1 className="text-2xl font-bold">{data.profile?.name}</h1>
          <p className="text-gray-500">{data.profile?.email}</p> {/* Email added */}
          <p className="text-gray-600">{data.profile?.bio}</p>
        </div>
      </div>

      {/* Posts */}
      <h2 className="text-xl font-semibold mb-4">Posts</h2>
      {data.posts?.length > 0 ? (
        <div className="space-y-4">
          {data.posts.map((post) => (
            <div
              key={post._id}
              className="bg-white shadow rounded-lg p-4"
            >
              {post.newsText?.trim() && (
                <p className="text-gray-800">{post.newsText}</p>
              )}

              {/* Show media if exists */}
              {Array.isArray(post.media) && post.media.length > 0 && (
                <img
                  src={
                    typeof post.media[0] === "string"
                      ? post.media[0]
                      : post.media[0]?.url || ""
                  }
                  alt="Post"
                  className="mt-2 w-full max-h-96 object-cover rounded-lg"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              )}

              <p className="text-xs text-gray-500 mt-2">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No posts yet.</p>
      )}
    </div>
  );
}
