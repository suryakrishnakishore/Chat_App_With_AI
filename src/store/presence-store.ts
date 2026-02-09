import { create } from "zustand";

export const usePresenceStore = create<any>((set) => ({
    onlineUsers: {},

    setPresenceList: (list: any) => set({ onlineUsers: list }),

    setOnline: (userId: any) => {
        set((state: any) => ({
            onlineUsers: {
                ...state.onlineUsers,
                [userId.toString()]: true
            }
        }));
    },

    setOffline: (userId: any) =>
        set((state: any) => {
            const updated = { ...state.onlineUsers };
            delete updated[userId.toString()];
            return { onlineUsers: updated };
        }),
}));

