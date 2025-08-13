// // src/components/EventGallery.js
// import React, { useEffect, useState } from "react";
// import { getMediaByEvent, uploadMedia } from "../lib/api.js";
// import { useParams } from "react-router-dom";

// const EventGallery = () => {
//     const {eventId} = useParams(); 
//   const [media, setMedia] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [files, setFiles] = useState([]);
//   const [tags, setTags] = useState("");
//   const [uploading, setUploading] = useState(false);

//   const fetchMedia = async () => {
//     setLoading(true);
//     try {
//       const res = await getMediaByEvent(eventId);
//       if (res.success) {
//         setMedia(res.data);
//       }
//     } catch (err) {
//       console.error("Failed to fetch media:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (files.length === 0) return alert("Please select files first.");

//     try {
//       setUploading(true);
//       const res = await uploadMedia(eventId, Array.from(files), tags);
//       alert(res.message);
//       setFiles([]);
//       setTags("");
//       fetchMedia(); // refresh gallery
//     } catch (err) {
//       console.error("Upload failed:", err);
//     } finally {
//       setUploading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMedia();
//   }, [eventId]);

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Event Gallery</h2>

//       {loading ? (
//         <p>Loading media...</p>
//       ) : media.length > 0 ? (
//         <div className="grid grid-cols-3 gap-4">
//           {media.map((item) => (
//             <img
//               key={item._id}
//               src={item.file}
//               alt="Event media"
//               className="w-full h-48 object-cover rounded"
//             />
//           ))}
//         </div>
//       ) : (
//         <p>No media uploaded yet.</p>
//       )}

//       {/* Upload Section */}
//       <div className="mt-8 border-t pt-4">
//         <h3 className="text-lg font-semibold">Upload Media</h3>
//         <form onSubmit={handleUpload} className="space-y-4">
//           <input
//             type="file"
//             multiple
//             onChange={(e) => setFiles(e.target.files)}
//             className="block w-full border rounded p-2"
//           />
//           <input
//             type="text"
//             placeholder="Tags (comma separated)"
//             value={tags}
//             onChange={(e) => setTags(e.target.value)}
//             className="block w-full border rounded p-2"
//           />
//           <button
//             type="submit"
//             disabled={uploading}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
//           >
//             {uploading ? "Uploading..." : "Upload"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EventGallery;


import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMediaByEvent, uploadMedia } from "../lib/api.js";

export default function EventGallery() {
  const { eventId } = useParams();
  const queryClient = useQueryClient();

  const [files, setFiles] = useState([]);
  const [tags, setTags] = useState("");

  // Fetch media with useQuery
  const { data, isLoading, isError } = useQuery({
    queryKey: ["media", eventId],
    queryFn: () => getMediaByEvent(eventId),
    select: (res) => res.data || [], // "select" lets you transform API response
  });

  // Upload mutation
  const { mutate: uploadMutation, isPending } = useMutation({
    mutationFn: () => uploadMedia(eventId, Array.from(files), tags),
    onSuccess: () => {
      alert("Upload successful");
      setFiles([]);
      setTags("");
      // Refresh media after upload
      queryClient.invalidateQueries({ queryKey: ["media", eventId] });
    },
    onError: () => {
      alert("Upload failed");
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

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Event Gallery</h2>

      {/* Loading / Error */}
      {isLoading && <p>Loading media...</p>}
      {isError && <p className="text-red-500">Failed to load media</p>}

      {/* Media Grid */}
      {!isLoading && data?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data.map((item) => (
            <img
              key={item._id}
              src={item.file}
              alt="Event media"
              className="w-full h-48 object-cover rounded"
            />
          ))}
        </div>
      )}

      {!isLoading && data?.length === 0 && <p>No media uploaded yet.</p>}

      {/* Upload Form */}
      <div className="mt-8 border-t pt-4">
        <h3 className="text-lg font-semibold">Upload Media</h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
            className="block w-full border rounded p-2"
          />
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {Array.from(files).map((file, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-16 h-16 object-cover rounded"
                />
              ))}
            </div>
          )}
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="block w-full border rounded p-2"
          />
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isPending ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}



