"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/lib/apiCalls";
import { getSocket } from "@/lib/socket";
import PrivateChatBubble from "./private-chat-bubble";
import useStore from "@/store";

export default function PrivateChatCard({ conversation }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { user } = useStore();

  // Fetch history
  const loadMessages = async () => {
    try {
      const res = await api.get(`/api/messages?chatId=${conversation._id}`);
      setMessages(res.data.messages);
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [conversation._id]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  return (
    <div className="p-4 space-y-3 overflow-y-auto h-full">
      {messages.map((msg) => (
        <PrivateChatBubble
          key={msg._id}
          msg={msg}
          currentUserId={user?.id}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
