import { create } from "zustand";

interface MessageStore {
    messages: Record<string, any[]>,
    addMessage: (chatId: string, msg: any) => void,
    setMessages: (chatId: string, msgs: any[]) => void
}

export const useMessageStore = create<MessageStore>((set, get) => ({
    messages: {},

    setMessages: (chatId, msgs) => {
        set((state) => ({
            messages: {
                ...state.messages,
                [chatId]: msgs
            }

        }));
    },

    addMessage: (chatId, msg) => {
        set((state) => ({
            messages: {
                ...state.messages,
                [chatId]: [...(state.messages[chatId] || []), msg],
            }
        }));
    }

}));