import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/user/register", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/user/login", loginData);
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post("/user/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/user/me", { withCredentials: true });
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

// src/api/event.api.js


// 📌 Event API Functions


/** 1️⃣ Create Event */
export const createEvent = async (eventData) => {
  console.log("📡 Creating event...");
  try {
    const res = await axiosInstance.post("/events/createEvent", eventData);
    console.log("✅ Event created:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Create event failed:", err);
    throw err;
  }
};

/** 2️⃣ Get Single Event */
export const getEvent = async (eventId) => {
  console.log(`📡 Fetching event ${eventId}...`);
  try {
    const res = await axiosInstance.get(`/events/${eventId}`);
    console.log("✅ Event fetched:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Get event failed:", err);
    throw err;
  }
};

/** 3️⃣ Update Event */
export const updateEvent = async (eventId, updateData) => {
  console.log(`📡 Updating event ${eventId}...`);
  try {
    const res = await axiosInstance.put(`/events/${eventId}`, updateData);
    console.log("✅ Event updated:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Update event failed:", err);
    throw err;
  }
};

/** 4️⃣ Delete Event */
export const deleteEvent = async (eventId) => {
  console.log(`📡 Deleting event ${eventId}...`);
  try {
    const res = await axiosInstance.delete(`/events/${eventId}`);
    console.log("✅ Event deleted:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Delete event failed:", err);
    throw err;
  }
};

/** 5️⃣ Get All Events */
export const getAllEvents = async () => {
  console.log("📡 Fetching all events...");
  try {
    const res = await axiosInstance.get("/events/getAllEvents");
    console.log("✅ All events fetched:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Get all events failed:", err);
    throw err;
  }
};

/** 6️⃣ Remove Invitee from Event */
export const removeInviteeFromEvent = async (eventId, userId) => {
  console.log(`📡 Removing invitee ${userId} from event ${eventId}...`);
  try {
    const res = await axiosInstance.delete(`/events/${eventId}/invitees/${userId}`);
    console.log("✅ Invitee removed:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Remove invitee failed:", err);
    throw err;
  }
};

export const getAllUsers = async () => {
  const res = await axiosInstance.get("/user/getAllUsers",{  withCredentials: true });
  return res.data;
}
//  export const uploadMedia = async (formData) => {
//   const res = await axiosInstance.post("/media/upload", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   return res.data;}

export const getMediaByEvent = async (eventId) => {
  const res = await axiosInstance.get(`/media/${eventId}`);
  return res.data; // { success, data }
};

export const uploadMedia = async (eventId, files, tags) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  if (tags) {
    formData.append("tags", tags);
  }

  const res = await axiosInstance.post(`/media/upload/${eventId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data; // { success, message, data }
};

export const getStreamToken = async () => {
  const res = await axiosInstance.get("/messages/token", { withCredentials: true });

  console.log("🔹 Server /messages/token response:", res.data);

  if (!res.data?.token) {
    throw new Error("No token in response from server");
  }

  return res.data; // { token, userId, name }
};

export const createOrJoinChannel = async (eventId) => {
   console.log("jdsnvgjv");
  const res = await axiosInstance.post(`/messages/${eventId}/channel`, {}, { withCredentials: true });
  return res.data; // { success, members }
}

// src/lib/api.js


// Get all unique friend IDs
export const getFriendIds = async () => {
  console.log("📡 Fetching unique friend IDs...");
  try {
    const res = await axiosInstance.get("/friends/unique");
    console.log("✅ Friend IDs fetched:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch friend IDs:", err);
    throw err;
  }
};


export const createPost = async (data) => {
  const res = await axiosInstance.post("/posts", data, {
    headers: { "Content-Type": "multipart/form-data" } // For file uploads
  });
  return res.data;
};

// ✅ Get my own posts
export const getMyPosts = async () => {
  const res = await axiosInstance.get("/posts/my");
  return res.data.posts;
};

// ✅ Get profile + posts of a specific user
export const getUserProfileWithPosts = async (id) => {
  const res = await axiosInstance.get(`/posts/user/${id}`);
  return res.data;
};

// ✅ Get all friend IDs


// ✅ Get recent posts from multiple users
// frontend/api.js
export const getRecentPostsOfFriends = async (friendIds) => {
  console.log("📡 Fetching recent posts for friends:", friendIds);
  try {
    const res = await axiosInstance.post(
      "/posts/friends",
      { friendIds },
      {
        headers: {
          "Content-Type": "application/json", // ✅ Force JSON body
        },
      }
    );

    console.log("✅ Posts fetched:", res.data);
    return res.data.posts;
  } catch (err) {
    console.error("❌ Failed to fetch posts:", err.response?.data || err.message);
    throw err;
  }
};

