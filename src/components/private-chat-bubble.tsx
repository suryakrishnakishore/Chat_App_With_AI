"use client";

import React from "react";

export default function PrivateChatBubble({ msg, currentUserId }: any) {
  const isMe = msg.senderId === currentUserId;
  console.log("IsME", isMe);
  
  return (
    <div
      className={`flex w-full my-1 ${
        isMe ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-xs px-4 py-2 rounded-xl text-sm shadow 
          ${isMe ? "bg-[hsl(var(--green-primary))] text-white" 
                 : "bg-[hsl(var(--gray-secondary))] text-[hsl(var(--foreground))]"
          }`}
      >
        {msg.content}
        <div className="text-[10px] opacity-60 text-right mt-1">
          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}
