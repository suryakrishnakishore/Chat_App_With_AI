import React from 'react';
import ConversationHeader from '../conversation-header';
import { useConversationStore } from '@/store/chat-store';
import MessageContainer from '../message-container';
import MessageInput from '../message-input';

const Conversation = () => {
  const { selectedConversation } = useConversationStore();

  return (
    <div className="flex flex-col h-full bg-[hsl(var(--chat-tile-light))] dark:bg-[hsl(var(--chat-tile-dark))] rounded-lg shadow-lg">
      <ConversationHeader conversation={selectedConversation} />
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <MessageContainer />
      </div>
      <MessageInput />
    </div>
  );
};

export default Conversation;
