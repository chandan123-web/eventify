


import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/Authuser";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getStreamToken, createOrJoinChannel } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

// import Stream Chat styles
import "stream-chat-react/dist/css/v2/index.css";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { eventId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  const createChannelMutation = useMutation({
    mutationFn: createOrJoinChannel,
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser || !eventId) return;

      try {
        const { members } = await createChannelMutation.mutateAsync(eventId);

        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.name,
            image: "https://cdn.pixabay.com/photo/2023/06/23/11/23/ai-generated-8083323_1280.jpg",
          },
          tokenData.token
        );

        const currChannel = client.channel("messaging", eventId, {
          members,
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to event chat.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, eventId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${eventId}`;
      channel.sendMessage({
        text: `Join the event video call: ${callUrl}`,
      });
      toast.success("Video call link sent!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[88vh] flex flex-col bg-base-100 rounded-xl shadow-md overflow-hidden">
      <Chat client={chatClient} theme="str-chat__theme-light">
        <Channel channel={channel}>
          <div className="flex-1 flex flex-col relative">
            {/* Call button floating at the top */}
            <div className="absolute top-2 right-2 z-10">
              <CallButton handleVideoCall={handleVideoCall} />
            </div>

            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
