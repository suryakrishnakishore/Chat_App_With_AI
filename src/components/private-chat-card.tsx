"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/lib/apiCalls";
import { getSocket } from "@/lib/socket";
import useStore from "@/store";
import PrivateChatBubble from "./private-chat-bubble";
import { formatDateforChat } from "@/lib/utils";

export default function PrivateChatCard({ conversation }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { user } = useStore();

  // Fetch message history
  const loadMessages = async () => {
    try {
      const res = await api.get(`/api/messages/get-by-id/${conversation._id}`);
      setMessages(res.data.messages);
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [conversation._id]);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Join / Leave room
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit("conversation:join", { chatId: conversation._id });

    return () => {
      socket.emit("conversation:leave", { chatId: conversation._id });
    };
  }, [conversation._id]);

  // Listen for real-time messages
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("message:new", (data) => {
      if (data.chatId === conversation._id) {
        setMessages((prev) => [...prev, data.message]);
      }
    });

    return () => {
      socket.off("message:new");
    };
  }, [conversation._id]);

  // GROUP MESSAGES BY DATE
  const groupMessagesByDate = (msgs: any[]) => {
    const grouped: Record<string, any[]> = {};

    msgs.forEach((msg) => {
      const dateKey = new Date(msg.timestamp).toDateString(); 
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(msg);
    });

    return grouped;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="p-4 space-y-3 overflow-y-auto h-full">

      {Object.keys(groupedMessages).map((date) => (
        <div key={date}>
          <div className="flex justify-center my-2">
            <span className="text-xs px-3 py-1 rounded-md bg-[hsl(var(--gray-primary))] text-[hsl(var(--foreground))]">
              {formatDateforChat(date)}
            </span>
          </div>

          {groupedMessages[date].map((msg: any) => (
            <PrivateChatBubble
              key={msg._id}
              msg={msg}
              currentUserId={user?._id}
            />
          ))}
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
