"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ArrowLeft, Video } from "lucide-react";
import { useConversationStore, usePanelStore } from "@/store/chat-store";
import useStore from "@/store";
import api from "@/lib/apiCalls";

export default function PrivateConversationHeader({ conversation }: any) {
  const { setSelectedConversation } = useConversationStore();
  const { setPanel } = usePanelStore();
  const { user } = useStore((state) => state);

  let participantId = conversation?.participants[0];
  if(conversation.participants[1] !== user._id) participantId = conversation.participants[1];

  let participant: any;
  async function getParticipant() {
    try {
        const res = await api.get(`/api/user/get-by-id/${participantId}`);
        participant = res.data.user;
    } 
    catch (err: any) {
        console.log("Error while fetching the participant of chat: ", err);
        
    }

  }
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
