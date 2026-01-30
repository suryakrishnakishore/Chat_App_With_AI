import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import UserImage from "../../public/placeholder.png";

function SearchedConversations({ conversation }: any) {
  return (
    <div
      className="
        flex items-center gap-4 p-4 mb-2
        rounded-xl border shadow-sm cursor-pointer
        bg-[hsl(var(--container))] border-[hsl(var(--gray-primary))]
        hover:bg-[hsl(var(--gray-secondary))] transition-all
      "
    >
      {/* Avatar */}
      <Avatar className="w-12 h-12">
        <AvatarImage
          src={conversation?.profileImage || UserImage.src}
          alt={conversation?.name || conversation?.username}
          className="object-cover"
        />
        <AvatarFallback>
          {conversation?.name?.charAt(0) ?? "?"}
        </AvatarFallback>
      </Avatar>

      {/* User Info */}
      <div className="flex flex-col min-w-0 flex-1">
        {/* Full Name */}
        <p className="font-semibold text-[hsl(var(--foreground))] truncate">
          {conversation?.name ?? "Unknown User"}
        </p>

        {/* Username */}
        <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">
          @{conversation?.username}
        </p>

        {/* About */}
        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 truncate">
          {conversation?.about
            ? conversation.about
            : "Hey there! I am using the chat app."}
        </p>
      </div>
    </div>
  );
}

export default SearchedConversations;
