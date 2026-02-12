"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import UserImage from "../../public/placeholder.png";
import { formatDate } from "@/lib/utils";
import { ImageIcon, VideoIcon } from "lucide-react";
import { MessageSeenSvg } from "@/lib/svgs";
import useStore from "@/store";
import api from "@/lib/apiCalls";
import { useConversationStore } from "@/store/chat-store";

export default function Conversations({ conversation }: any) {
  const { user } = useStore((state) => state);
  const { selectedConversation } = useConversationStore();

  const me = user?._id;
  const isSelected = selectedConversation?._id === conversation._id;
  const isGroup = conversation.chatType === "group";

  const [otherUser, setOtherUser] = useState<any>(null);

  console.log(`${me} conersations: `, conversation.unreadCount);
  
  useEffect(() => {
    if (isGroup) return;

    const otherUserId = conversation.participants?.find((p: any) => p !== me);
    if (!otherUserId) return;

    async function fetchUser() {
      try {
        const res = await api.get(`/api/user/get-by-id/${otherUserId}`);
        setOtherUser(res.data.user);
      } catch (err) {
        console.log("Error fetching other user", err);
      }
    }

    fetchUser();
  }, [conversation, me, isGroup]);

  const displayName = isGroup
    ? conversation.groupName
    : otherUser?.name || "User";

  const displayUsername = isGroup
    ? conversation.groupUsername
    : otherUser?.username || "";

  const displayImage = isGroup
    ? conversation.groupImage
    : otherUser?.profileImage ?? UserImage;

  const last = conversation.lastMessage;
  const lastMsgText = last?.content ?? "";
  const isMyMessage = last?.senderId === me;

  const containerStyle = isSelected
    ? "bg-[hsl(var(--gray-secondary))] border-[hsl(var(--foreground))]"
    : conversation.unreadCount > 0
    ? "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700"
    : "bg-[hsl(var(--container))] border-[hsl(var(--gray-primary))] hover:bg-[hsl(var(--gray-secondary))]";

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition cursor-pointer shadow-sm mb-2 ${containerStyle}`}
    >
      {/* Avatar */}
      <Avatar className="w-12 h-12 relative">
        {!isGroup && otherUser?.isOnline && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[hsl(var(--container))]" />
        )}

        <AvatarImage src={displayImage} className="rounded-full object-cover" />
        <AvatarFallback>
          <div className="animate-pulse bg-[hsl(var(--gray-secondary))] w-full h-full rounded-full"></div>
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Name */}
        <p
          className={`truncate ${
            conversation.unreadCount > 0 && !isSelected
              ? "font-bold text-[hsl(var(--foreground))]"
              : "font-semibold text-[hsl(var(--foreground))]"
          }`}
        >
          {displayName}
        </p>

        {!isGroup && (
          <p className="text-xs text-[hsl(var(--muted-foreground))] -mt-1 truncate">
            @{displayUsername}
          </p>
        )}

        {/* Last Message */}
        <div
          className={`flex items-center text-xs truncate mt-[2px] ${
            conversation.unreadCount > 0 && !isSelected
              ? "text-[hsl(var(--foreground))]"
              : "text-[hsl(var(--muted-foreground))]"
          }`}
        >
          {isGroup && !isMyMessage && (
            <span className="mr-1 font-medium">
              {last?.senderName ?? "User"}:
            </span>
          )}

          <div className="truncate flex items-center">
            {isMyMessage && <MessageSeenSvg className="mr-1" />}

            {last?.messageType === "image" && (
              <ImageIcon className="mr-1" size={16} />
            )}
            {last?.messageType === "video" && (
              <VideoIcon className="mr-1" size={16} />
            )}

            {lastMsgText.length > 30
              ? lastMsgText.slice(0, 30) + "..."
              : lastMsgText}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-col items-end ml-2">
        <span
          className={`text-xs whitespace-nowrap ${
            conversation.unreadCount > 0 && !isSelected
              ? "text-green-600 dark:text-green-400 font-semibold"
              : "text-[hsl(var(--muted-foreground))]"
          }`}
        >
          {conversation.updatedAt
            ? formatDate(
                new Date(conversation.updatedAt).toDateString()
              )
            : ""}
        </span>

        {!isSelected && conversation.unreadCount > 0 && (
          <span className="mt-1 text-[10px] bg-green-500 text-white rounded-full px-2 py-[2px] min-w-[20px] text-center">
            {conversation.unreadCount}
          </span>
        )}
      </div>
    </div>
  );
}
