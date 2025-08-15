import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import EventCard from "../components/Eventcard";
import { getAllEvents } from "../lib/api";

const  Homepage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: getAllEvents,
  });

  const events = data?.events || [];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-4 sm:p-6 lg:p-8"
      data-theme="forest"
    >
      <div className="container mx-auto space-y-8 sm:space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold drop-shadow-lg">
               AllEvents
            </h2>
            <p className="opacity-90 mt-1 text-sm sm:text-base">
              Stay tuned and never miss a moment ✨
            </p>
          </div>
        
        </div>

        {/* Event List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-white" />
          </div>
        ) : events.length === 0 ? (
          <div className="card bg-base-100 p-6 sm:p-8 text-center shadow-xl rounded-xl">
            <h3 className="font-bold text-lg sm:text-xl mb-2">
              No events available
            </h3>
            <p className="opacity-70 text-sm sm:text-base">
              Check back later for more events!
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            style={{
              maxHeight: "calc(100vh - 200px)",
              overflowY: "auto",
            }}
          >
            {events.map((event) => (
              <div
                key={event._id}
                className="flex w-full transform transition duration-300 hover:scale-[1.02]"
              >
                <EventCard event={event} className="w-full" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
