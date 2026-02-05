"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/lib/apiCalls";
import { getSocket } from "@/lib/socket";
import useStore from "@/store";
import PrivateChatBubble from "./private-chat-bubble";

export default function PrivateChatCard({ conversation }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { user } = useStore();

  // Fetch history
  const loadMessages = async () => {
    try {
      const res = await api.get(`/api/messages/get-by-id/${conversation._id}`);
      console.log("response: ", res);
      
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

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit("conversation:join", { chatId: conversation._id });

    return () => {
      socket.emit("conversation:leave", { chatId: conversation._id });
    };
  }, [conversation]);

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
