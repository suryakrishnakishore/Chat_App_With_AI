"use client";
import Image from 'next/image';
import React from 'react';
import DesktopTcon from "../../../public/desktop-hero.png";
import { useConversationStore, usePanelStore } from '@/store/chat-store';
import Conversation from './conversation';

const RightPanel = () => {
  const { panel } = usePanelStore();
  const { selectedConversation } = useConversationStore();

  return (
    <div className="flex flex-col h-full w-full bg-[hsl(var(--gray-primary))] overflow-hidden">
      {panel ? (
        <div className="flex flex-col h-full">
          <Conversation />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center bg-[hsl(var(--gray-tertiary))] h-full w-full px-6 py-12 rounded-lg">
          <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80">
            <Image
              src={DesktopTcon}
              width={320}
              height={320}
              alt="Desktop Icon"
              className="object-contain rounded-2xl shadow-2xl bg-[hsl(var(--gray-secondary))] p-3"
              priority
            />
          </div>
          <h1 className="text-3xl font-semibold text-[hsl(var(--foreground))] mt-6 mb-3">
            Welcome to <span className="text-[hsl(var(--green-primary))]">ChatHub</span> 💬
          </h1>
          <p className="text-base text-gray-400 max-w-md leading-relaxed">
            Your <span className="font-semibold text-[hsl(var(--green-primary))]">AI-powered</span> chat companion.<br />
            Start a conversation by selecting or creating a new chat from the left panel.
          </p>
        </div>
      )}
    </div>
  );
};

export default RightPanel;
