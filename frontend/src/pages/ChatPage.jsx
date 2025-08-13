// import { useEffect, useState } from "react";
// import { useParams } from "react-router";
// import useAuthUser from "../hooks/Authuser";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { getStreamToken, createOrJoinChannel } from "../lib/api";

// import {
//   Channel,
//   ChannelHeader,
//   Chat,
//   MessageInput,
//   MessageList,
//   Thread,
//   Window,
// } from "stream-chat-react";
// import { StreamChat } from "stream-chat";
// import toast from "react-hot-toast";

// import ChatLoader from "../components/ChatLoader";
// import CallButton from "../components/CallButton";

// const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// const ChatPage = () => {
//   const { eventId } = useParams();
//   const [chatClient, setChatClient] = useState(null);
//   const [channel, setChannel] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const { authUser } = useAuthUser();

//   const { data: tokenData } = useQuery({
//     queryKey: ["streamToken"],
//     queryFn: getStreamToken,
//     enabled: !!authUser,
//   });

//   const createChannelMutation = useMutation({
//     mutationFn: createOrJoinChannel,
//   });

//   useEffect(() => {
//     const initChat = async () => {
//       if (!tokenData?.token || !authUser || !eventId) return;

//       try {
//         console.log("Joining event chat...");

//         // Step 1: Create/join the event channel from backend
//         const { members } = await createChannelMutation.mutateAsync(eventId);

//         // Step 2: Connect to Stream
//         const client = StreamChat.getInstance(STREAM_API_KEY);
//         await client.connectUser(
//           {
//             id: authUser._id,
//             name: authUser.fullName,
//             image: authUser.profilePic,
//           },
//           tokenData.token
//         );

//         // Step 3: Use eventId as channel name
//         const currChannel = client.channel("messaging", eventId, {
//           members,
//         });

//         await currChannel.watch();

//         setChatClient(client);
//         setChannel(currChannel);
//       } catch (error) {
//         console.error("Error initializing chat:", error);
//         toast.error("Could not connect to event chat.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     initChat();
//   }, [tokenData, authUser, eventId]);

//   const handleVideoCall = () => {
//     if (channel) {
//       const callUrl = `${window.location.origin}/call/${eventId}`;
//       channel.sendMessage({
//         text: `Join the event video call: ${callUrl}`,
//       });
//       toast.success("Video call link sent!");
//     }
//   };

//   if (loading || !chatClient || !channel) return <ChatLoader />;

//   return (
//     <div className="h-[93vh]">
//       <Chat client={chatClient}>
//         <Channel channel={channel}>
//           <div className="w-full relative">
//             <CallButton handleVideoCall={handleVideoCall} />
//             <Window>
//               <ChannelHeader />
//               <MessageList />
//               <MessageInput focus />
//             </Window>
//           </div>
//           <Thread />
//         </Channel>
//       </Chat>
//     </div>
//   );
// };

// export default ChatPage;

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
    enabled: !!authUser, // run only when user exists
  });

  const createChannelMutation = useMutation({
    mutationFn: createOrJoinChannel,
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser || !eventId) return;

      try {
        console.log("Joining event chat...");

        // Step 1: Get channel members from backend
        const { members } = await createChannelMutation.mutateAsync(eventId);

        // Step 2: Connect to Stream
        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.name,
            image: "https://www.freepik.com/free-vector/cute-boy-standing-position-showing-thumb_8821174.htm#fromView=keyword&page=1&position=1&uuid=18e925c2-b384-49bb-a1a9-fdd2715f0fec&query=Boy+Cartoon",
          },
          tokenData.token
        );

        // Step 3: Create/Join channel
        const currChannel = client.channel("messaging", eventId, { members });
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
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
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
