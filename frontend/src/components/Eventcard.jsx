import React from "react";
import { useNavigate } from "react-router-dom";
import fallbackImage from "../assets/chn.svg";

export default function EventCard({ event }) {
  const navigate = useNavigate();

  const handleClickMedia = () => {
    navigate(`/events/${event._id}/media`);
  };

  const handleClickChat = () => {
    navigate(`/events/${event._id}/chat`);
  };

  return (
    <div className="max-w-sm w-full bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* Event Cover Image */}
      <div className="relative w-full h-36 sm:h-48">
        <img
          src={event.coverImage || fallbackImage}
          alt={event.name}
          className="h-full w-full object-cover"
        />
        {event.isPublic === false && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow">
            Private
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
        {/* Title */}
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-1">
          {event.name}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>

        {/* Extra Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <span className="font-medium">Created By:</span>{" "}
            {event.ownerId?.name || "Unknown"}
          </p>
          <p>
            <span className="font-medium">Published On:</span>{" "}
            {event.createdAt
              ? new Date(event.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col xs:flex-row sm:flex-row gap-2 mt-3">
          <button
            onClick={handleClickMedia}
            className="w-full sm:flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200"
          >
            📷 Media
          </button>
          <button
            onClick={handleClickChat}
            className="w-full sm:flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors duration-200"
          >
            💬 Chat
          </button>
        </div>
      </div>
    </div>
  );
}

