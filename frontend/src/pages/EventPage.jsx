import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent } from "../lib/api.js";

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    isPublic: true,
    invitedUsers: ""
  });

  const queryClient = useQueryClient();
  const { mutate: createEventMutation, isPending, error } = useMutation({
    mutationFn: createEvent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createEventMutation(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto space-y-4">
      <div>
        <label className="block">Event Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input input-bordered w-full"
          required
        />
      </div>

      <div>
        <label className="block">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="textarea textarea-bordered w-full"
          required
        />
      </div>

      <div>
        <label className="block">Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="input input-bordered w-full"
          required
        />
      </div>

      <div>
        <label className="block">Invite Users (comma-separated emails)</label>
        <input
          type="text"
          value={formData.invitedUsers}
          onChange={(e) =>
            setFormData({ ...formData, invitedUsers: e.target.value })
          }
          className="input input-bordered w-full"
        />
      </div>

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
        <div className="alert alert-error">{error.response.data.message}</div>
      )}

      <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
        {isPending ? "Creating..." : "Create Event"}
      </button>
    </form>
  );
}
