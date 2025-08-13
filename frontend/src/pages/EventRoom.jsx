// src/pages/EventRoom.jsx
import React, { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../lib/axios.js";
import { useQuery } from "@tanstack/react-query";

import Peer from "simple-peer";
import { useParams } from "react-router-dom";

export default function EventRoom() {
  const { eventId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [users, setUsers] = useState([]);
  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState({});
  const chatEndRef = useRef(null);

  // Fetch old messages
  useQuery({
    queryKey: ["messages", eventId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/messages/${eventId}`);
      setMessages(res.data.data);
      return res.data.data;
    },
  });

  // Get short-lived socket token
  const { data: socketToken, isLoading: tokenLoading } = useQuery({
    queryKey: ["socketToken"],
    queryFn: async () => {
      const res = await axiosInstance.post("/messages");
      return res.data.token;
    },
  });

  const socket = useSocket(tokenLoading ? null : socketToken);

  useEffect(() => {
    if (!socket) return;
    socket.emit("join_event", eventId);
    socket.on("event_users", (list) => setUsers(list));
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("offer", ({ offer, fromSocketId }) => {
      const peer = new Peer({ initiator: false, trickle: false, stream });
      peer.on("signal", (answer) => {
        socket.emit("answer", { toSocketId: fromSocketId, answer });
      });
      peer.signal(offer);
      peer.on("stream", (remoteStream) => {
        document.getElementById("remoteVideo").srcObject = remoteStream;
      });
      setPeers((p) => ({ ...p, [fromSocketId]: peer }));
    });

    socket.on("answer", ({ fromSocketId, answer }) => {
      peers[fromSocketId]?.signal(answer);
    });

    socket.on("ice-candidate", ({ fromSocketId, candidate }) => {
      peers[fromSocketId]?.signal(candidate);
    });

    return () => {
      socket.off("event_users");
      socket.off("receive_message");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [socket, stream, peers]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (newMsg.trim() && socket) {
      const msg = {
        _id: Date.now().toString(),
        senderName: localStorage.getItem("name") || "You",
        text: newMsg,
      };
      setMessages((prev) => [...prev, msg]);
      socket.emit("send_message", { eventId, text: newMsg });
      setNewMsg("");
    }
  };

  const startCall = async (user) => {
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setStream(localStream);
    document.getElementById("localVideo").srcObject = localStream;

    const peer = new Peer({ initiator: true, trickle: false, stream: localStream });
    peer.on("signal", (offer) => {
      socket.emit("offer", { eventId, offer, toSocketId: user.socketId });
    });
    peer.on("stream", (remoteStream) => {
      document.getElementById("remoteVideo").srcObject = remoteStream;
    });
    setPeers((p) => ({ ...p, [user.socketId]: peer }));
  };

  if (tokenLoading) return <div className="p-6 text-lg font-semibold">Connecting...</div>;

  return (
    <div className="flex h-screen bg-[#ece5dd]">
      {/* Sidebar - Users */}
      <div className="w-64 bg-white border-r border-gray-300 p-4 overflow-y-auto">
        <h3 className="text-lg font-bold mb-3">Contacts</h3>
        {users.map((u) => (
          <div
            key={u.userId}
            className="flex justify-between items-center mb-3 p-2 hover:bg-gray-100 rounded-lg"
          >
            <span>{u.name}</span>
            {u.userId !== localStorage.getItem("userId") && (
              <button
                onClick={() => startCall(u)}
                className="px-2 py-1 bg-green-500 text-white rounded-lg text-sm"
              >
                📹
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Chat Section */}
      <div className="flex flex-col flex-1">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((m) => (
            <div
              key={m._id}
              className={`mb-2 flex ${
                m.senderName === localStorage.getItem("name") ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg shadow text-sm max-w-xs ${
                  m.senderName === localStorage.getItem("name")
                    ? "bg-[#dcf8c6] text-black"
                    : "bg-white text-black"
                }`}
              >
                <span className="block font-semibold">{m.senderName}</span>
                <span>{m.text}</span>
              </div>
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        {/* Message Input */}
        <div className="p-3 bg-white border-t border-gray-300 flex gap-2">
          <input
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Type a message"
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full"
          >
            ➤
          </button>
        </div>
      </div>

      {/* Video Section */}
      <div className="w-80 bg-white border-l border-gray-300 p-4 flex flex-col">
        <h2 className="text-lg font-bold mb-3">Video Call</h2>
        <video id="localVideo" autoPlay muted className="w-full rounded-lg bg-black mb-3"></video>
        <video id="remoteVideo" autoPlay className="w-full rounded-lg bg-black"></video>
      </div>
    </div>
  );
}
