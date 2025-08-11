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


// 1️⃣ Create Event
export const createEvent = async (eventData) => {
  const res = await axiosInstance.post("/events/createEvent", eventData);
  return res.data;
};


// 2️⃣ Get Single Event
export const getEvent = async (eventId) => {
  const res = await api.get(`/events/${eventId}`);
  return res.data;
};

// 3️⃣ Update Event
export const updateEvent = async (eventId, updateData) => {
  const res = await api.put(`/events/${eventId}`, updateData);
  return res.data;
};

// 4️⃣ Delete Event
export const deleteEvent = async (eventId) => {
  const res = await api.delete(`/events/${eventId}`);
  return res.data;
};

// 5️⃣ Get All Events (with filters, sorting, pagination)
export const getAllEvents = async () => {
  console.log("📡 Calling /events/getAllEvents...");
  try {
    const res = await axiosInstance.get("/events/getAllEvents");
    console.log("✅ Response from API:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ API call failed:", err);
    throw err;
  }
};



// 6️⃣ Remove Invitee from Event
export const removeInviteeFromEvent = async (eventId, userId) => {
  const res = await api.delete(`/events/${eventId}/invitees/${userId}`);
  return res.data;
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