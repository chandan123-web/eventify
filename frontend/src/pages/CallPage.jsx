import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthUser from "../hooks/Authuser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";
// import PageLoader from "../components/";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { eventId } = useParams(); // eventId from /call/:eventId
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();

  // Fetch Stream token
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.token || !authUser || !eventId) return;

      try {
        console.log("Initializing video client for event:", eventId);

        const user = {
          id: authUser._id,
          name: authUser.name,
          image: authUser.profilePic || "https://cdn.pixabay.com/photo/2023/06/23/11/23/ai-generated-8083323_1280.jpg",
        };

        // Initialize Stream Video Client
        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        // Create or join the call (callId = eventId)
        const callInstance = videoClient.call("default", eventId);

        await callInstance.join({ create: true });

        setClient(videoClient);
        setCall(callInstance);
        console.log("Joined call successfully");
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();
  }, [tokenData, authUser, eventId]);

  if (isLoading || isConnecting) return <ChatLoader/>;

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-base-100">
      {client && call ? (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <CallContent navigate={navigate} />
          </StreamCall>
        </StreamVideo>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>Could not initialize call. Please refresh or try again later.</p>
        </div>
      )}
    </div>
  );
};

const CallContent = ({ navigate }) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  // If user leaves call, redirect back to home or events page
  if (callingState === CallingState.LEFT) {
    navigate("/");
    return null;
  }

  return (
    <StreamTheme>
      <SpeakerLayout /> {/* Grid of participants */}
      <CallControls /> {/* Buttons for mic, camera, leave */}
    </StreamTheme>
  );
};

export default CallPage;
