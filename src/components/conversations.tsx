"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import UserImage from "../../public/placeholder.png";
import { formatDate } from "@/lib/utils";
import { ImageIcon, VideoIcon } from "lucide-react";
import { MessageSeenSvg } from "@/lib/svgs";
import useStore from "@/store";
import api from "@/lib/apiCalls";
import { getSocket } from "@/lib/socket";

export default function Conversations({ conversation }: any) {
  const { user } = useStore((state) => state);
  const me = user?._id;

  const isGroup = conversation.chatType === "group";

  const [otherUser, setOtherUser] = useState<any>(null);

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

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[hsl(var(--gray-primary))] bg-[hsl(var(--container))] hover:bg-[hsl(var(--gray-secondary))] transition cursor-pointer shadow-sm mb-2">

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

      <div className="flex flex-col flex-1 min-w-0">
        <p className="font-semibold text-[hsl(var(--foreground))] truncate">
          {displayName}
        </p>

        {!isGroup && (
          <p className="text-xs text-[hsl(var(--muted-foreground))] -mt-1 truncate">
            @{displayUsername}
          </p>
        )}

        <div className="flex items-center text-xs text-[hsl(var(--muted-foreground))] truncate mt-[2px]">
          {isGroup && !isMyMessage && (
            <span className="mr-1 font-medium">
              {last?.senderName ?? "User"}:
            </span>
          )}

          <div className="truncate flex items-center">
            {isMyMessage && <MessageSeenSvg className="mr-1" />}

            {last?.messageType === "image" && <ImageIcon className="mr-1" size={16} />}
            {last?.messageType === "video" && <VideoIcon className="mr-1" size={16} />}

            {lastMsgText.length > 30
              ? lastMsgText.slice(0, 30) + "..."
              : lastMsgText}
          </div>
        </div>
      </div>

      <div className="text-xs text-[hsl(var(--muted-foreground))] whitespace-nowrap ml-2">
        {conversation.updatedAt ? formatDate(new Date(conversation.updatedAt).toDateString()) : ""}
      </div>
    </div>
  );
}
