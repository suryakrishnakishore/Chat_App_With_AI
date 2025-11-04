"use client";
import Image from 'next/image';
import React, { useState } from 'react'
import DesktopTcon from "../../../public/desktop-hero.png";
import { usePanelStore } from '@/store/chat-store';
import Conversation from './conversation';

const RightPanel = () => {
  const { panel, setPanel } = usePanelStore();
  console.log("Pantel", panel);
  
  return (
    <div className='flex flex-col h-full w-full'>
      {panel ? (
        <div className=''>
          <Conversation />
        </div>
      ) : (
        <div className="flex flex-col bg-[hsl(var(--gray-tertiary))] items-center pt-[15%] h-full w-full mx-auto px-6 py-12">
          <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 flex items-center justify-center">
            <Image
              src={DesktopTcon}
              fill={false}
              width={320}
              height={320}
              alt="Desktop Icon"
              className="object-contain rounded-xl shadow-lg bg-[hsl(var(--gray-secondary))] p-2"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] mt-4 mb-2 text-center">
            Welcome to ChatHub!
          </h1>
          <p className="text-base text-gray-400 text-center max-w-md">
            Your <span className="font-semibold text-[hsl(var(--green-primary))]">AI-powered</span> chat companion.<br />
            Start a conversation by selecting or creating a new chat from the left panel.
          </p>
        </div>
      )}
    </div>
  )
}

export default RightPanel