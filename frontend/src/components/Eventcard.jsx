import React from "react";
import { useNavigate } from "react-router-dom";
import myimage from "../assets/chn.svg"; 
export default function EventCard({ event }) {
  const navigate = useNavigate();

   const handleClick = () => {
    // Navigate to the media page for this event
    navigate(`/events/${event._id}/media`);
  };
  const handleClickchat = () => {
    // Navigate to the chat page for this event
     navigate(`/events/${event._id}/chat`);
  };

  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      {/* Image */}
      <figure>
        <img
          src={
            // myimage
            "https://images.pexels.com/photos/33322570/pexels-photo-33322570.jpeg" 
            // // fallback image
          }
          alt={event.name}
          className="h-48 w-full object-cover"
        />
      </figure>

      {/* Body */}
      <div className="card-body">
        <h2 className="card-title">{event.name}</h2>
        <p className="text-sm text-gray-600">{event.description}</p>

        {/* Extra info */}
        <div className="text-sm text-gray-500 mt-3 space-y-1">
          <p>
            <span className="font-semibold">Created By:</span>{" "}
            {event.ownerId?.name || "Unknown"}
          </p>
          <p>
            <span className="font-semibold">Published On:</span>{" "}
            {event.createdAt
              ? new Date(event.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>

        {/* Action */}
        <div className="card-actions justify-end mt-4">
          <button onClick={handleClick} className="btn btn-primary">
            media
          </button>
        </div>

          <div className="card-actions justify-start mt-4">
          <button onClick={handleClickchat} className="btn btn-primary">
            chat
          </button>
        </div>
      </div>
    </div>
  );
}








