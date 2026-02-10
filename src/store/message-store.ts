import { create } from "zustand";

interface MessageStore {
    messages: Record<string, any[]>,
    addMessage: (chatId: string | number, msg: any) => void,
    setMessages: (chatId: string | number, msgs: any[]) => void
    updateMessageStatus: (
        chatId: string,
        messageIds: string[] | string,
        status: "sent" | "delivered" | "read"
    ) => void;

    clearChatMessages: (chatId: string) => void;
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
    },

    updateMessageStatus: (chatId, messageIds, status) => {
        const ids = Array.isArray(messageIds) ? messageIds : [messageIds];

        set((state) => {
            const chatMessages = state.messages[chatId] || [];
            const updated = chatMessages.map((msg) =>
                ids.includes(msg._id)
                    ? { ...msg, status }
                    : msg
            );

            return {
                messages: {
                    ...state.messages,
                    [chatId]: updated,
                },
            };
        });
    },

    clearChatMessages: (chatId) => {
        set((state) => {
            const updated = { ...state.messages };
            delete updated[chatId];
            return { messages: updated };
        });
    },

}));