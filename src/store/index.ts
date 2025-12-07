import { create } from "zustand";

type storeState = {
    user: any,
    setCredentials: (val: any) => void,
    signOut: () => void
};

const getInitialUser = (): any | null => {
    if(typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem("chatUser");
        return raw ? JSON.parse(raw) : null;
    }
    catch (error) {
        return null;
    }
}

const useStore = create<storeState>((set) => ({
    user: getInitialUser(),
    
    setCredentials: (val: any) => {
        try {
            if(typeof window !== "undefined") localStorage.setItem("chatUser", JSON.stringify(val));
        }
        catch {}
        set({ user: val });
    },
    signOut: () => {
        try {
            if(typeof window !== "undefined") localStorage.removeItem("chatUser");
        }
        catch {}

        set({ user: null });
    }
}));

export default useStore;