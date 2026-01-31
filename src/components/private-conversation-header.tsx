"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ArrowLeft, Video } from "lucide-react";
import { useConversationStore, usePanelStore } from "@/store/chat-store";
import useStore from "@/store";
import api from "@/lib/apiCalls";
import { useEffect, useState } from "react";

export default function PrivateConversationHeader({ conversation }: any) {
  const { setSelectedConversation } = useConversationStore();
  const { setPanel } = usePanelStore();
  const { user } = useStore((state) => state);
  
  const me = user?._id;
  const isGroup = conversation?.chatType === "group";

  const [participant, setParticipant] = useState({});

  useEffect(() => {
    if (isGroup) return;

    const otherUserId = conversation.participants?.find((p: any) => p !== me);
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
      </Avatar>

      <div className="flex flex-col">
        <p className="font-semibold">{participant?.name}</p>
        <p className="text-xs text-gray-500">@{participant?.username}</p>
      </div>

      <Video className="ml-auto cursor-pointer hover:text-[hsl(var(--green-primary))]" />
    </div>
  );
}
