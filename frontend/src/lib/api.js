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
    const res = await axiosInstance.get("/user/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

// src/api/event.api.js


// 1️⃣ Create Event
export const createEvent = async (eventData) => {
  const res = await api.post("/events", eventData);
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
export const getAllEvents = async (params = {}) => {
  const res = await api.get("/events", { params });
  return res.data;
};

// 6️⃣ Remove Invitee from Event
export const removeInviteeFromEvent = async (eventId, userId) => {
  const res = await api.delete(`/events/${eventId}/invitees/${userId}`);
  return res.data;
};

