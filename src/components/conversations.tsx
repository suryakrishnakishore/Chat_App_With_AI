import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import UserImage from "../../public/placeholder.png"
import { formatDate } from '@/lib/utils'
import { ImageIcon, VideoIcon } from 'lucide-react';
import { MessageSeenSvg } from '@/lib/svgs';

type Conversation = {
  _id: number | string;
  isOnline: boolean;
  groupImage: string;
  groupName?: string;
  sender: string;
  admin?: boolean;
  lastMessage: { content: string, sender: string, messageType: string  };
  _creationTime: number;
};

interface ConversationsProps {
  conversation: Conversation;
}

const Conversations: React.FC<ConversationsProps> = ({ conversation }) => {
  const lastMessage: { content: string, sender: string, messageType: string  } = conversation?.lastMessage;
  const lastMessageType: string = conversation?.lastMessage?.messageType;
  const me: string = "user1";
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[hsl(var(--gray-primary))] bg-[hsl(var(--container))] hover:bg-[hsl(var(--gray-secondary))] transition-colors cursor-pointer shadow-sm mb-2">
      <div>
        <Avatar className="w-12 h-12 overflow-visible relative">
          {conversation.isOnline && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[hsl(var(--container))] shadow-lg"></span>
          )}
          <AvatarImage
            src={conversation?.groupImage ?? UserImage}
            className="rounded-full object-cover"
            alt="User or Group image"
          />
          <AvatarFallback>
            <div className="animate-pulse bg-[hsl(var(--gray-secondary))] w-full h-full rounded-full"></div>
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <p className="font-semibold text-[hsl(var(--foreground))] truncate">{conversation.groupName || conversation.sender}</p>
        <div className="flex flex-row items-center text-xs text-[hsl(var(--muted-foreground))] truncate">
          {(conversation.admin && lastMessage?.sender !== me) && (
            <span className="mr-1 font-medium">{conversation.sender}:</span>
          )}
          <div className="truncate flex items-center">
            {lastMessage?.sender === me ? <MessageSeenSvg className='mr-1' /> : ""}
            {lastMessageType === "image" && <ImageIcon className='mr-1' size={16} />}
						{lastMessageType === "video" && <VideoIcon className='mr-1' size={16} />}
            {(
							lastMessage?.content.length > 30 ? (
								<span>{lastMessage?.content.slice(0, 30)}...</span>
							) : (
								<span>{lastMessage?.content}</span>
							)
						)}
						
          </div>
        </div>
      </div>

      <div className="text-xs text-[hsl(var(--muted-foreground))] whitespace-nowrap ml-2">
        {formatDate(conversation._creationTime)}
      </div>
    </div>
  )
}

export default Conversations