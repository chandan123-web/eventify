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
  });
  const [userOptions, setUserOptions] = useState([]);
  const [isRedirecting, setIsRedirecting] = useState(false); // ✅ manual navigation state

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
      });
      setIsRedirecting(true); // ✅ start redirect state
      setTimeout(() => navigate("/login"), 500); // short delay for UX
    },
    onError: (err) => {
      console.error("Mutation error:", err);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createEventMutation({
      ...formData,
      invitedUsers: formData.invitedUsers.map((u) => u.value),
    });
  };

  // Show redirecting UI if navigating away
  if (isRedirecting) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Redirecting...
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Event name */}
        <div>
          <label className="block font-medium">Event Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="textarea textarea-bordered w-full"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block font-medium">Date</label>
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

        {/* Invite users */}
        <div>
          <label className="block font-medium">Invite Users</label>
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
          />
          <label>Public Event</label>
        </div>

        {error && (
          <div className="alert alert-error">
            {error.response?.data?.message || "Something went wrong"}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
