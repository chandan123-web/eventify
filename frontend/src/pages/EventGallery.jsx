import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMediaByEvent, uploadMedia } from "../lib/api.js";

export default function EventGallery() {
  const { eventId } = useParams();
  const queryClient = useQueryClient();

  const [files, setFiles] = useState([]);
  const [tags, setTags] = useState("");
  const [modal, setModal] = useState({ isOpen: false, type: null, src: "" });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["media", eventId],
    queryFn: () => getMediaByEvent(eventId),
    select: (res) => res.data || [],
  });

  const { mutate: uploadMutation, isPending } = useMutation({
    mutationFn: () => uploadMedia(eventId, Array.from(files), tags),
    onSuccess: () => {
      alert("✅ Upload successful!");
      setFiles([]);
      setTags("");
      queryClient.invalidateQueries({ queryKey: ["media", eventId] });
    },
    onError: () => {
      alert("❌ Upload failed. Try again.");
    },
  });

  const handleUpload = (e) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("Please select files first");
      return;
    }
    uploadMutation();
  };

  const openModal = (type, src) => {
    setModal({ isOpen: true, type, src });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: null, src: "" });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-[#fdfcfb] min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center text-purple-600">
        📸 Event Gallery
      </h2>

      {/* Loading / Error */}
      {isLoading && <p className="text-center text-gray-500 animate-pulse">Loading media...</p>}
      {isError && <p className="text-center text-red-500">Failed to load media</p>}

      {/* Media Grid */}
      {!isLoading && data?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.map((item) => {
            const isVideo = item.file.match(/\.(mp4|webm|ogg)$/i);
            return (
              <div
                key={item._id}
                className="relative group cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white"
                onClick={() => openModal(isVideo ? "video" : "image", item.file)}
              >
                {isVideo ? (
                  <video
                    src={item.file}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={item.file}
                    alt="Event media"
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-25 transition"></div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && data?.length === 0 && (
        <p className="text-center text-gray-500">No media uploaded yet.</p>
      )}

      {/* Upload Form Card */}
     {/* Upload Form */}
<div className="mt-12 border-t pt-8">
  <h3 className="text-xl font-semibold mb-6 text-purple-600 text-center">
    Upload Media
  </h3>
  <form
    onSubmit={handleUpload}
    className="space-y-4 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition 
               max-w-md mx-auto"  // ⬅ makes it small and centered
  >
    <input
      type="file"
      multiple
      accept="image/*,video/*"
      onChange={(e) => setFiles(e.target.files)}
      className="block w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-400 outline-none"
    />

    {files.length > 0 && (
      <div className="flex flex-wrap gap-3">
        {Array.from(files).map((file, idx) => {
          const isVideo = file.type.startsWith("video");
          return isVideo ? (
            <video
              key={idx}
              src={URL.createObjectURL(file)}
              className="w-20 h-20 object-cover rounded-lg shadow"
              muted
            />
          ) : (
            <img
              key={idx}
              src={URL.createObjectURL(file)}
              alt="preview"
              className="w-20 h-20 object-cover rounded-lg shadow"
            />
          );
        })}
      </div>
    )}

    <input
      type="text"
      placeholder="Tags (comma separated)"
      value={tags}
      onChange={(e) => setTags(e.target.value)}
      className="block w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-400 outline-none"
    />

    <button
      type="submit"
      disabled={isPending}
      className="bg-purple-500 text-white px-5 py-2 rounded-lg shadow hover:bg-purple-600 
                 hover:shadow-lg transition disabled:bg-gray-400 w-full"
    >
      {isPending ? "Uploading..." : "Upload"}
    </button>
  </form>
</div>


      {/* Modal */}
      {modal.isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl w-full">
            {modal.type === "image" ? (
              <img
                src={modal.src}
                alt="Full view"
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />
            ) : (
              <video
                src={modal.src}
                controls
                autoPlay
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />
            )}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-white text-3xl font-bold hover:text-purple-300 transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}




// import React, { useState } from "react";
// import { useParams } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { getMediaByEvent, uploadMedia } from "../lib/api.js";

// export default function EventGallery() {
//   const { eventId } = useParams();
//   const queryClient = useQueryClient();

//   const [files, setFiles] = useState([]);
//   const [tags, setTags] = useState("");
//   const [modal, setModal] = useState({ isOpen: false, type: null, src: "" });

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["media", eventId],
//     queryFn: () => getMediaByEvent(eventId),
//     select: (res) => res.data || [],
//   });

//   const { mutate: uploadMutation, isPending } = useMutation({
//     mutationFn: () => uploadMedia(eventId, Array.from(files), tags),
//     onSuccess: () => {
//       alert("✅ Upload successful!");
//       setFiles([]);
//       setTags("");
//       queryClient.invalidateQueries({ queryKey: ["media", eventId] });
//     },
//     onError: () => {
//       alert("❌ Upload failed. Try again.");
//     },
//   });

//   const handleUpload = (e) => {
//     e.preventDefault();
//     if (files.length === 0) {
//       alert("Please select files first");
//       return;
//     }
//     uploadMutation();
//   };

//   const openModal = (type, src) => {
//     setModal({ isOpen: true, type, src });
//   };

//   const closeModal = () => {
//     setModal({ isOpen: false, type: null, src: "" });
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-4 bg-[#f8f9fa] min-h-screen">
//       <h2 className="text-3xl font-bold mb-8 text-center text-purple-700">
//         📸 Event Gallery
//       </h2>

//       {/* Loading / Error */}
//       {isLoading && <p className="text-center text-gray-500 animate-pulse">Loading media...</p>}
//       {isError && <p className="text-center text-red-500">Failed to load media</p>}

//       {/* Media Grid */}
//       {!isLoading && data?.length > 0 && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {data.map((item) => {
//             const isVideo = item.file.match(/\.(mp4|webm|ogg)$/i);
//             return (
//               <div
//                 key={item._id}
//                 className="relative group cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white"
//                 onClick={() => openModal(isVideo ? "video" : "image", item.file)}
//               >
//                 {isVideo ? (
//                   <video
//                     src={item.file}
//                     className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
//                     muted
//                     playsInline
//                   />
//                 ) : (
//                   <img
//                     src={item.file}
//                     alt="Event media"
//                     className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
//                   />
//                 )}
//                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-25 transition"></div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {!isLoading && data?.length === 0 && (
//         <p className="text-center text-gray-500">No media uploaded yet.</p>
//       )}

//       {/* Upload Form */}
//       <div className="mt-12 border-t pt-8">
//         <h3 className="text-xl font-semibold mb-6 text-purple-600">Upload Media</h3>
//         <form
//           onSubmit={handleUpload}
//           className="space-y-4 bg-white p-6 rounded-xl shadow-md transition hover:shadow-lg"
//         >
//           <input
//             type="file"
//             multiple
//             accept="image/*,video/*"
//             onChange={(e) => setFiles(e.target.files)}
//             className="block w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-400 outline-none"
//           />
//           {files.length > 0 && (
//             <div className="flex flex-wrap gap-3">
//               {Array.from(files).map((file, idx) => {
//                 const isVideo = file.type.startsWith("video");
//                 return isVideo ? (
//                   <video
//                     key={idx}
//                     src={URL.createObjectURL(file)}
//                     className="w-20 h-20 object-cover rounded-lg shadow"
//                     muted
//                   />
//                 ) : (
//                   <img
//                     key={idx}
//                     src={URL.createObjectURL(file)}
//                     alt="preview"
//                     className="w-20 h-20 object-cover rounded-lg shadow"
//                   />
//                 );
//               })}
//             </div>
//           )}
//           <input
//             type="text"
//             placeholder="Tags (comma separated)"
//             value={tags}
//             onChange={(e) => setTags(e.target.value)}
//             className="block w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-400 outline-none"
//           />
//           <button
//             type="submit"
//             disabled={isPending}
//             className="bg-purple-500 text-white px-5 py-2 rounded-lg shadow hover:bg-purple-600 hover:shadow-lg transition disabled:bg-gray-400"
//           >
//             {isPending ? "Uploading..." : "Upload"}
//           </button>
//         </form>
//       </div>

//       {/* Modal */}
//       {modal.isOpen && (
//         <div
//           className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
//           onClick={closeModal}
//         >
//           <div className="relative max-w-4xl w-full">
//             {modal.type === "image" ? (
//               <img
//                 src={modal.src}
//                 alt="Full view"
//                 className="w-full max-h-[80vh] object-contain rounded-lg"
//               />
//             ) : (
//               <video
//                 src={modal.src}
//                 controls
//                 autoPlay
//                 className="w-full max-h-[80vh] object-contain rounded-lg"
//               />
//             )}
//             <button
//               onClick={closeModal}
//               className="absolute top-3 right-3 text-white text-3xl font-bold hover:text-purple-400 transition"
//             >
//               ✕
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
