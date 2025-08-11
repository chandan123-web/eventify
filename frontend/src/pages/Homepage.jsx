// import React from 'react'


import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import EventCard from "../components/Eventcard"; // the dynamic EventCard we wrote earlier
import { getAllEvents } from "../lib/api";// you’ll need to create this API function

const EventsPage = () => {
const { data, isLoading } = useQuery({
  queryKey: ["events"],
  queryFn: getAllEvents,
});

const events = data?.events || [];


  console.log("Events:", events);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        {/* Header */}
        {/* <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Upcoming Events</h2>
          <Link to="/events/create" className="btn btn-primary btn-sm">
            Create Event
          </Link>
        </div> */}

        {/* Event list */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : events.length === 0 ? (
          <div className="card bg-base-200 p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">No events available</h3>
            <p className="text-base-content opacity-70">
              Check back later for more events!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
// import React from 'react'

// export default function HomePage() {
//   return (
//     <div>
      
//     </div>
//   )
// }

export default EventsPage;
