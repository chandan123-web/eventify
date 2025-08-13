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
    // <div className="p-4 sm:p-6 lg:p-8">
    //   <div className="container mx-auto space-y-10">
    //     {/* Header */}
    //     {/* <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    //       <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Upcoming Events</h2>
    //       <Link to="/events/create" className="btn btn-primary btn-sm">
    //         Create Event
    //       </Link>
    //     </div> */}

    //     {/* Event list */}
    //     {isLoading ? (
    //       <div className="flex justify-center py-12">
    //         <span className="loading loading-spinner loading-lg" />
    //       </div>
    //     ) : events.length === 0 ? (
    //       <div className="card bg-base-200 p-6 text-center">
    //         <h3 className="font-semibold text-lg mb-2">No events available</h3>
    //         <p className="text-base-content opacity-70">
    //           Check back later for more events!
    //         </p>
    //       </div>
    //     ) : (
    //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
    //         {events.map((event) => (
    //           <EventCard key={event._id} event={event} />
    //         ))}
    //       </div>
    //     )}
    //   </div>
    // </div>
  //    <div className="p-4 sm:p-6 lg:p-8 h-full">
  //   <div className="container mx-auto flex flex-col h-full">
  //     {/* Header */}
  //     {/* You can uncomment the header if needed */}

  //     {/* Event list */}
  //     <div className="flex-1 overflow-y-auto">
  //       {isLoading ? (
  //         <div className="flex justify-center py-12">
  //           <span className="loading loading-spinner loading-lg" />
  //         </div>
  //       ) : events.length === 0 ? (
  //         <div className="card bg-base-200 p-6 text-center">
  //           <h3 className="font-semibold text-lg mb-2">No events available</h3>
  //           <p className="text-base-content opacity-70">
  //             Check back later for more events!
  //           </p>
  //         </div>
  //       ) : (
  //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  //           {events.map((event) => (
  //             <EventCard key={event._id} event={event} />
  //           ))}
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // </div>
     
      <div className="p-4 sm:p-6 lg:p-8">
    <div className="container mx-auto space-y-10">
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
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 200px)" }} // keeps scroll within viewport
        >
          {events.map((event) => (
            <div
              key={event._id}
              className="flex w-full h-full" // ensures card fills height without overlap
            >
              <EventCard event={event} className="w-full h-full" />
            </div>
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
