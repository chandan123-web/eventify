// src/pages/CreatePostPage.jsx
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../lib/api";

export default function CreatePostPage() {
  const queryClient = useQueryClient();

  // Form states
  const [newsText, setNewsText] = useState("");
  const [location, setLocation] = useState("");
  const [media, setMedia] = useState([]);

  // React Query mutation for post creation
  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      console.log("✅ Post created successfully");
      queryClient.invalidateQueries(["posts"]); // Refresh the feed after creating a post
      // Reset form
      setNewsText("");
      setLocation("");
      setMedia([]);
    },
    onError: (err) => {
      console.error("❌ Failed to create post:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to create post");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newsText.trim() && media.length === 0) {
      alert("Please enter text or attach media.");
      return;
    }

    const formData = new FormData();
    formData.append("newsText", newsText);
    if (location) formData.append("location", location);
    media.forEach((file) => formData.append("media", file));

    mutation.mutate(formData);
  };

  const handleFileChange = (e) => {
    setMedia(Array.from(e.target.files));
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* News Text */}
        <textarea
          placeholder="What's on your mind?"
          value={newsText}
          onChange={(e) => setNewsText(e.target.value)}
          className="w-full p-3 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
        />

        {/* Location */}
        <input
          type="text"
          placeholder="Location (optional)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Media Upload */}
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileChange}
          className="w-full"
        />

        {/* Preview selected files */}
        {media.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3">
            {media.map((file, idx) => (
              <div key={idx} className="border p-1 rounded">
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-20 w-20 object-cover rounded"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(file)}
                    className="h-20 w-20 rounded"
                    controls
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={mutation.isLoading}
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition disabled:opacity-50"
        >
          {mutation.isLoading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
}
