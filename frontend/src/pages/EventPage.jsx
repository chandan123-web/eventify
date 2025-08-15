import { useState, useEffect } from "react";
import Select from "react-select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent, getAllUsers } from "../lib/api.js";
import { useNavigate } from "react-router-dom";

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    isPublic: true,
    invitedUsers: [],
    coverImage: null,
  });
  const [preview, setPreview] = useState(null);
  const [userOptions, setUserOptions] = useState([]);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch all users for dropdown
  useEffect(() => {
    async function fetchUsers() {
      try {
        const users = await getAllUsers();
        setUserOptions(
          users.map((user) => ({
            value: user.email,
            label: `${user.name} (${user.email})`,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    }
    fetchUsers();
  }, []);

  const { mutate: createEventMutation, isPending, error } = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setFormData({
        name: "",
        description: "",
        date: "",
        isPublic: true,
        invitedUsers: [],
        coverImage: null,
      });
      setPreview(null);
      setIsRedirecting(true);
      setTimeout(() => navigate("/login"), 500);
    },
    onError: (err) => {
      console.error("Mutation error:", err);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const eventData = new FormData();
    eventData.append("name", formData.name);
    eventData.append("description", formData.description);
    eventData.append("date", formData.date);
    eventData.append("isPublic", formData.isPublic);
    eventData.append(
      "invitedUsers",
      JSON.stringify(formData.invitedUsers.map((u) => u.value))
    );
    if (formData.coverImage) {
      eventData.append("coverImage", formData.coverImage);
    }

    createEventMutation(eventData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData({ ...formData, coverImage: file });

    const fileURL = URL.createObjectURL(file);
    setPreview(fileURL);
  };

  if (isRedirecting) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Redirecting...
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          Create New Event
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Event name */}
          <div>
            <label className="block font-semibold mb-1">Event Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="input input-bordered w-full"
              placeholder="Enter event name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="textarea textarea-bordered w-full"
              placeholder="Describe your event..."
              rows={4}
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block font-semibold mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block font-semibold mb-1">Cover Image</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleImageChange}
              className="file-input file-input-bordered w-full"
            />
            {preview && (
              <div className="mt-3">
                {formData.coverImage?.type.startsWith("video") ? (
                  <video
                    src={preview}
                    controls
                    className="rounded-lg w-full max-h-64 object-cover"
                  />
                ) : (
                  <img
                    src={preview}
                    alt="Preview"
                    className="rounded-lg w-full max-h-64 object-cover"
                  />
                )}
              </div>
            )}
          </div>

          {/* Invite users */}
          <div>
            <label className="block font-semibold mb-1">Invite Users</label>
            <Select
              isMulti
              options={userOptions}
              value={formData.invitedUsers}
              onChange={(selected) =>
                setFormData({ ...formData, invitedUsers: selected })
              }
              placeholder="Select users by email..."
            />
          </div>

          {/* Public toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) =>
                setFormData({ ...formData, isPublic: e.target.checked })
              }
              className="checkbox"
            />
            <label className="font-medium">Public Event</label>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-error">
              {error.response?.data?.message || "Something went wrong"}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
