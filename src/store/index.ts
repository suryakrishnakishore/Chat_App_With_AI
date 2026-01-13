import { create } from "zustand";
import { getSocket } from "@/lib/socket";

type StoreState = {
  user: any | null;
  hydrateUser: () => void;
  setCredentials: (user: any) => void;
  signOut: () => void;
};

const useStore = create<StoreState>((set) => ({
  user: null,

  hydrateUser: () => {
    try {
      const raw = localStorage.getItem("chatUser");
      if (raw) {
        const user = JSON.parse(raw);
        set({ user });
      }
    } catch (err) {
      console.error("Hydration error:", err);
    }
  },

  setCredentials: (user) => {
    try {
      localStorage.setItem("chatUser", JSON.stringify(user));
    } catch (err) {
      console.error("Set creds error:", err);
    }
    set({ user });
  },

  signOut: () => {
    try {
      localStorage.removeItem("chatUser");
    } catch (err) {
      console.error("Sign out error:", err);
    }

    const socket = getSocket();
    if (socket) socket.disconnect();

    set({ user: null });
  },
}));

export default useStore;
