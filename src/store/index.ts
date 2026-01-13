import { create } from "zustand";
import { getSocket } from "@/lib/socket";

type StoreState = {
  user: any | null;
  hydrated: boolean;
  hydrateUser: () => void;
  setCredentials: (val: any) => void;
  signOut: () => void;
};

const useStore = create<StoreState>((set) => ({
  user: null,
  hydrated: false,

  hydrateUser: () => {
    try {
      const raw = localStorage.getItem("chatUser");
      const user = raw ? JSON.parse(raw) : null;
      set({ user, hydrated: true });
    } catch {
      set({ user: null, hydrated: true });
    }
  },

  setCredentials: (val) => {
    localStorage.setItem("chatUser", JSON.stringify(val));
    set({ user: val });
  },

  signOut: () => {
    localStorage.removeItem("chatUser");
    const socket = getSocket();
    if (socket) socket.disconnect();
    set({ user: null });
  },
}));

export default useStore;
