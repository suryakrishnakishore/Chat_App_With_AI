import React from 'react';
import ConversationHeader from '../conversation-header';
import { useConversationStore } from '@/store/chat-store';
import MessageContainer from '../message-container';
import MessageInput from '../message-input';
import bgLight from '../../../public/bg-light.png';
import bgDark from '../../../public/bg-dark.png';
import { useTheme } from 'next-themes';
import PrivateChatCard from '../private-chat-card';
import PrivateConversationHeader from '../private-conversation-header';
import GroupConversationHeader from '../group-conversation-header';
import GroupChatCard from '../group-chat-card';

const Conversation = () => {
  const { selectedConversation } = useConversationStore();
  const { theme } = useTheme();

  const isGroup = selectedConversation?.chatType === "group";

  const backgroundImage = theme === 'dark' ? bgDark.src : bgLight.src;
  return (
    <div className="flex flex-col h-full rounded-lg shadow-lg bg-cover bg-center transition-all duration-300"
         style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {isGroup ? (
        <GroupConversationHeader conversation={selectedConversation} />
      ) : (
        <PrivateConversationHeader conversation={selectedConversation} />
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isGroup ? (
          <GroupChatCard conversation={selectedConversation} />
        ) : (
          <PrivateChatCard conversation={selectedConversation} />
        )}
      </div>
      <MessageInput />
    </div>
  );
};

export default Conversation;
