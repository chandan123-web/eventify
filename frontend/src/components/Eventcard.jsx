/* eslint-disable react/prop-types */


export default function EventCard({ event }) {
  return (
    // <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow w-96 mx-auto">
    //   {/* Image */}
    //   <div>
    //     <img
    //       src={event.image || "https://via.placeholder.com/384x200"} // fallback image
    //       alt={event.name}
    //       className="w-full h-48 object-cover rounded-t-lg"
    //     />
    //   </div>

    //   {/* Card Body */}
    //   <div className="p-4">
    //     <h2 className="text-lg font-semibold text-gray-800">{event.name}</h2>
    //     <p className="text-sm text-gray-600 mt-1">{event.description}</p>

    //     {/* Event Details */}
    //     <div className="text-sm text-gray-500 space-y-1 mt-3">
    //       <p>
    //         <span className="font-semibold">Created By:</span>{" "}
    //         {event.ownerName || "Unknown"}
    //       </p>
    //       <p>
    //         <span className="font-semibold">Published On:</span>{" "}
    //         {new Date(event.createdAt).toLocaleDateString()}
    //       </p>
    //     </div>
    //   </div>
    // </div>
    <div className="card bg-base-100 w-96 shadow-sm">
  <figure>
    <img
      src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
      alt="Shoes" />
  </figure>
  <div className="card-body">
    <h2 className="card-title">Card Title</h2>
    <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Buy Now</button>
    </div>
  </div>
</div>
  );
}





