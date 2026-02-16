"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ArrowLeft, Video } from "lucide-react";
import { useConversationStore, usePanelStore } from "@/store/chat-store";
import useStore from "@/store";
import api from "@/lib/apiCalls";
import { useEffect, useState } from "react";
import { usePresenceStore } from "@/store/presence-store";
import { getSocket } from "@/lib/socket";
import { useCallStore } from "@/store/call-store";
import { usePeer } from "@/providers/peer-context";

export default function PrivateConversationHeader({ conversation }: any) {
  const { setSelectedConversation } = useConversationStore();
  const { setPanel } = usePanelStore();
  const { user } = useStore((state) => state);
  const { onlineUsers } = usePresenceStore((state) => state);
  const {
      isOpen,
      isIncoming,
      callType,
      remoteUser,
      minimized,
      openCall,
      closeCall,
      minimize,
      maximize,
    } = useCallStore();
  const { peer, createOffer } = usePeer();

  const me = user?._id;
  const isGroup = conversation?.chatType === "group";

  const [participant, setParticipant] = useState({});
  const otherUserId = conversation.participants?.find((p: any) => p !== me);

  useEffect(() => {
    if (isGroup) return;


    if (!otherUserId) return;

    async function fetchUser() {
      try {
        const res = await api.get(`/api/user/get-by-id/${otherUserId}`);
        setParticipant(res.data.user);
      } catch (err) {
        console.log("Error fetching other user", err);
      }
    }

    fetchUser();
  }, [conversation, me, isGroup]);

  function handleVideoCallClick() {
    const socket = getSocket();
    if (!socket) return;
    console.log("Video call click.");

    socket.emit("call:join", {
      roomId: conversation._id + "1818",
    });

    openCall({});
  }

  const isOnline = onlineUsers[otherUserId];
  console.log("User online: ", isOnline);
  return (
    <div className="px-4 py-3 border-b bg-[hsl(var(--gray-primary))] flex items-center gap-3 sticky top-0">
      <ArrowLeft
        className="cursor-pointer"
        onClick={() => {
          setSelectedConversation(null);
          setPanel(false);
        }}
      />

      <Avatar className="w-10 h-10">
        <AvatarImage src={participant?.profileImage} />
        <AvatarFallback>{participant?.username?.slice(0, 2)}</AvatarFallback>
        {isOnline && (
          <span className="absolute w-3 h-3 bg-green-500 rounded-full border-2 border-white top-0 right-0" />
        )}
      </Avatar>

      <div className="flex flex-col">
        <p className="font-semibold">{participant?.name}</p>
        <p className="text-xs text-gray-500">@{participant?.username}</p>
      </div>

      <Video
        onClick={handleVideoCallClick}
        className="ml-auto cursor-pointer hover:text-[hsl(var(--green-primary))]" />
    </div>
  );
}
