"use client";

import { PeerProvider } from "@/providers/peer-context";
import CallModal from "@/components/call-modal";
import useStore from "@/store";
import { useEffect } from "react";
import { getSocket, initSocket } from "@/lib/socket";
import { registerMessageEvents, registerPresenceEvents } from "@/lib/useSocket";

export default function Providers({ children }: { children: React.ReactNode }) {
    // const { user, hydrated } = useStore();

    // useEffect(() => {
    //     if (!hydrated) return;
    //     if (!user) return;
    //     console.log("Token for socket: ", user.token);

    //     initSocket(user.token);
    //     registerMessageEvents();
    //     registerPresenceEvents();
    //     const socket = getSocket();
    //     if (socket) {
    //         socket.emit("user:online", user._id);

    //     }
    // }, [user]);
    return (
        <PeerProvider>
            {children}
            <CallModal />
        </PeerProvider>
    );
}
