"use client";

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import UserImage from '../../../public/placeholder.png'
import { Button } from '../ui/button'
import { CgDarkMode } from "react-icons/cg";
import ThemeSwitch from '../theme-switch';
import { ListFilter, LogOut, MessageSquareDiff, Search, User } from 'lucide-react';
import { Input } from '../ui/input';
import Conversations from '../conversations';
import { conversations } from '@/dummyData/db';
import { useConversationStore, usePanelStore } from '@/store/chat-store';
import useStore from '@/store';
import UserProfileModal from '../modals/user-profile-modal';

const LeftPanel = () => {
  const { panel, setPanel } = usePanelStore();
  const { selectedConversation, setSelectedConversation } = useConversationStore();
  const { user, signOut } = useStore((state) => state);
  console.log("User left panel: ", user);
  
  const [ userPanel, setUserPanel ] = useState(false);
  const userPanelRef = useRef<HTMLDivElement | null>(null);

  const [ profileModal, setProfileModal ] = useState(false);
  const profileModalRef = useRef<HTMLDivElement | null>(null);

  const handleConversationClick = (conversation: any): void => {
    setPanel(true);
    setSelectedConversation(conversation);
  }

  const handleLogOut = () => {
    signOut();
  }

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (userPanelRef.current && !userPanelRef.current.contains(e.target as Node)) {
        setUserPanel(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className='flex flex-col h-full border-gray-600 w-1/3 border-r'>
      <div className='sticky top-0 bg-[hsl(var(--left-panel))] z-10'>
        <div className='flex bg-[hsl(var(--gray-primary))] items-center justify-between'>
          <button
            onClick={() => setUserPanel((s) => !s)}
            aria-expanded={userPanel}
            aria-haspopup="menu"
            className="flex items-center gap-2 ml-2 focus:outline-none"
          >
            {
              user?.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className='rounded-full object-cover cursor-pointer'
                />
              ) : (
                <User className='rounded-full' size={22} />
              )
            }
            <div className='hidden sm:flex flex-col text-left'>
              <span className='text-sm font-medium text-[hsl(var(--foreground))] leading-none'>
                {user?.name ?? (user?.email?.split("@")[0] ?? "You")}
              </span>
              <span className='text-xs text-[hsl(var(--muted-foreground))] leading-none'>
                @{user?.username ?? "unknown"}
              </span>
            </div>
          </button>

          {userPanel && (
            <div ref={userPanelRef} className="absolute top-10 mt-3 w-56 z-30">
              <div className="absolute -top-2 left-5 w-3 h-3 bg-[hsl(var(--container))] transform rotate-45 border-t border-l border-[hsl(var(--sidebar-border))]"></div>
              <div className="bg-[hsl(var(--container))] border border-[hsl(var(--sidebar-border))] rounded-lg shadow-lg overflow-hidden">
                <div className="px-3 py-3">
                  <p className="text-sm font-semibold text-[hsl(var(--foreground))] truncate">{user?.name ?? "No name"}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 truncate">{user?.email}</p>
                </div>
                <div className="divide-y divide-[hsl(var(--sidebar-border))]">
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[hsl(var(--gray-secondary))] transition-colors"
                    onClick={() => { 
                      setUserPanel(false);
                      setProfileModal(true);
                     }}
                  >
                    My Profile
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[hsl(var(--gray-secondary))] transition-colors"
                    onClick={() => { /* navigate to settings */ }}
                  >
                    Settings
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-[hsl(var(--gray-secondary))] transition-colors"
                    onClick={handleLogOut}
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className='flex h-full items-center p-3 gap-3'>
            <MessageSquareDiff size={20} className='cursor-pointer' />
            <ThemeSwitch />
            <LogOut onClick={handleLogOut} size={20} className='cursor-pointer' />
          </div>
        </div>

        <div className='p-3 flex items-center'>
          <Search size={20} className='absolute m-2 text-gray-400' />
          <Input
            type='text'
            placeholder='Search or start new chat'
            className='focus:ring-0 !bg-[hsl(var(--gray-primary))] text-gray-400 border-0 py-2 pl-8 text-sm mr-2 shadow-sm'
          />
          <ListFilter className='cursor-pointer' />
        </div>
      </div>

      <div className='overflow-auto flex flex-col max-h-[89%] gap-0 my-3'>
        {conversations?.map((conversation: any) => (
          <div onClick={() => handleConversationClick(conversation)}>
            <Conversations key={conversation._id} conversation={conversation} />
          </div>

        ))}
        {conversations?.length === 0 && (
          <div>
            <p className='text-center text-gray-500 text-sm mt-2'>No Conversations</p>
            <p className='text-center text-gray-500 text-sm mt-2'>
              We understand {"you're"} an introvert, but you need to start somewhere
            </p>
          </div>
        )}
      </div>

      <UserProfileModal open={profileModal} onClose={() => setProfileModal(false)} />
    </div>
  )
}

export default LeftPanel