"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { ListFilter, LogOut, MessageSquareDiff, Search, User } from "lucide-react";
import { Input } from "../ui/input";
import Conversations from "../conversations";
import { useConversationStore, usePanelStore } from "@/store/chat-store";
import useStore from "@/store";
import UserProfileModal from "../modals/user-profile-modal";
import api from "@/lib/apiCalls";
import { getSocket } from "@/lib/socket";
import ThemeSwitch from "../theme-switch";
import SearchInput from "../search-input";

const LeftPanel = () => {
  const { panel, setPanel } = usePanelStore();
  const [conversations, setConversations] = useState<any[]>([]);
  const { selectedConversation, setSelectedConversation } = useConversationStore();
  const { user, signOut } = useStore((state) => state);

  const [userPanel, setUserPanel] = useState(false);
  const userPanelRef = useRef<HTMLDivElement | null>(null);

  const [profileModal, setProfileModal] = useState(false);
  // Load conversations from API
  const loadConversations = async () => {
    if (!user) return;

    try {
      const res = await api.get(`/api/conversations/my`);
      setConversations(res.data.conversations);
    } catch (err) {
      console.error("Error fetching conversations:", err);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [user]);

  // Listen for new incoming messages
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("message:new", (data) => {
      const { chatId, message } = data;

      // Update only if it's this user's conversation
      setConversations((prev) => {
        return prev.map((c) =>
          c._id === chatId
            ? { ...c, lastMessage: message, updatedAt: new Date().toISOString() }
            : c
        );
      });
    });

    return () => {
      socket.off("message:new");
    };
  }, []);

  const handleConversationClick = (conversation: any) => {
    setPanel(true);
    setSelectedConversation(conversation);
  };

  const handleLogout = () => {
    signOut();
  };

  // Close dropdown when clicking outside
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
    <div className="flex flex-col h-full border-r border-gray-600 w-1/3">

      {/* Header */}
      <div className="sticky top-0 bg-[hsl(var(--left-panel))] z-10">
        <div className="flex bg-[hsl(var(--gray-primary))] items-center justify-between">

          {/* User Button */}
          <button
            onClick={() => setUserPanel((s) => !s)}
            className="flex items-center gap-2 ml-3"
          >
            {user?.profileImage ? (
              <Image
                src={user.profileImage}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <User size={22} className="rounded-full" />
            )}

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-medium text-[hsl(var(--foreground))] leading-none">
                {user?.name}
              </span>
              <span className="text-xs text-[hsl(var(--muted-foreground))] leading-none">
                @{user?.username}
              </span>
            </div>
          </button>

          {/* Dropdown */}
          {userPanel && (
            <div ref={userPanelRef} className="absolute top-12 left-3 w-56 z-30">
              <div className="bg-[hsl(var(--container))] border border-[hsl(var(--sidebar-border))] rounded-lg shadow-lg">
                <div className="px-3 py-3">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>

                <div className="divide-y divide-[hsl(var(--sidebar-border))]">
                  <button
                    className="w-full px-3 py-2 text-sm hover:bg-[hsl(var(--gray-secondary))]"
                    onClick={() => {
                      setUserPanel(false);
                      setProfileModal(true);
                    }}
                  >
                    My Profile
                  </button>
                  <button className="w-full px-3 py-2 text-sm hover:bg-[hsl(var(--gray-secondary))]">
                    Settings
                  </button>
                  <button
                    className="w-full px-3 py-2 text-sm text-red-500 hover:bg-[hsl(var(--gray-secondary))]"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Top-right icons */}
          <div className="flex items-center p-3 gap-3">
            <MessageSquareDiff size={20} className="cursor-pointer" />
            <ThemeSwitch />
            <LogOut size={20} className="cursor-pointer" onClick={handleLogout} />
          </div>
        </div>

        {/* Search Box */}
        <SearchInput />
      </div>

      {/* Conversations List */}
      <div className="overflow-auto flex flex-col max-h-[89%] gap-0 my-3 px-2">
        {conversations.map((c: any) => (
          <div key={c._id} onClick={() => handleConversationClick(c)}>
            <Conversations conversation={c} />
          </div>
        ))}

        {conversations.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No conversations yet</p>
        )}
      </div>

      {/* Profile Modal */}
      <UserProfileModal open={profileModal} onClose={() => setProfileModal(false)} />
    </div>
  );
};

export default LeftPanel;
