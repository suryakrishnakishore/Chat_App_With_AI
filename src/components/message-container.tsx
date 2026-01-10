"use client";

import { useMessageStore } from "@/store/message-store";
import ChatBubble from "./chat-bubble";
import { useConversationStore } from "@/store/chat-store";
import { useEffect } from "react";
import api from "@/lib/apiCalls";

export default function MessageContainer() {
  const { selectedConversation } = useConversationStore();
  const chatId = selectedConversation?._id;

  const messages = useMessageStore((state) => state.messages[chatId] || []);
  const setMessages = useMessageStore((state) => state.setMessages);

  useEffect(() => {
    if (!chatId) return;
    async function load() {
      const res = await api.get(`/api/messages/${chatId}`);
      if(chatId) setMessages(chatId.toString(), res.data.messages);
    }
    load();
  }, [chatId]);

  return (
    <div className="relative p-5 flex flex-col h-full bg-[hsl(var(--chat-tile-light))] dark:bg-[hsl(var(--chat-tile-dark))] overflow-y-auto">
      <div className="flex flex-col gap-4 mx-4 my-2">
        {messages.map((msg: any) => (
          <ChatBubble key={msg._id} msg={msg} />
        ))}
        <div id="chat-end" />
      </div>
    </div>
  );
}
