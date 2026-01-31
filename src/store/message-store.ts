import { create } from "zustand";

interface MessageStore {
    messages: Record<string, any[]>,
    addMessage: (chatId: string | number, msg: any) => void,
    setMessages: (chatId: string | number, msgs: any[]) => void
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