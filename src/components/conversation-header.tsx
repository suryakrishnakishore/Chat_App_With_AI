import React, { useCallback } from 'react';
import { Avatar, AvatarImage } from './ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import GroupMemebersDailog from './group-members-dailog';
import Link from 'next/link';
import { Video, X } from 'lucide-react';
import { useConversationStore, usePanelStore } from '@/store/chat-store';

const ConversationHeader = ({ conversation }: { conversation: any }) => {
  const { setSelectedConversation } = useConversationStore();
  const { setPanel } = usePanelStore();

  const handleClickX = useCallback(() => {
    setSelectedConversation(null);
    setPanel(false);
  }, [setSelectedConversation, setPanel]);

  if (!conversation) return null;

  return (
    <div className="sticky top-0 z-50 bg-[hsl(var(--gray-primary))] border-b border-gray-700 shadow-sm">
      <div className="flex justify-between items-center px-5 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={conversation?.groupImage || '/placeholder.png'} alt="Profile Image" className="object-cover" />
            <AvatarFallback>
              <div className="animate-pulse bg-gray-tertiary w-full h-full rounded-full" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-semibold text-[hsl(var(--foreground))]">{conversation?.groupName}</p>
            {conversation?.isGroup && (
              <span className="text-xs text-gray-400">Group Chat</span>
            )}
          </div>
          {conversation?.isGroup && <GroupMemebersDailog />}
        </div>

        <div className="flex items-center gap-6 text-gray-300">
          <Link href="/video-call">
            <Video size={22} className="hover:text-[hsl(var(--green-primary))] transition-colors" />
          </Link>
          <X
            size={22}
            className="cursor-pointer hover:text-red-400 transition-colors"
            onClick={handleClickX}
          />
        </div>
      </div>
    </div>
  );
};

export default ConversationHeader;
