import { create } from "zustand";

export type Conversation = {
  _id: number | string;
  isOnline: boolean;
  groupImage: string | null;
  groupName?: string | null;
  sender: string;
  admin?: string | null;
  lastMessage: { _id: number | string,content: string, sender: string, messageType: string  };
  _creationTime: number;
  participants: string[];
};

type ConversationStore = {
    selectedConversation: Conversation | null;
    setSelectedConversation: (conversation: Conversation) => void;
};

export const useConversationStore = create<ConversationStore>((set) => ({
    selectedConversation: null,
    setSelectedConversation: (conversation) => set({ selectedConversation: conversation })
}));

