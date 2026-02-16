import { create } from "zustand";

interface CallState {
  isOpen: boolean;
  isIncoming: boolean;
  callType: "audio" | "video" | null;
  remoteUser: any;
  minimized: boolean;
  peerConnection: RTCPeerConnection | null;

  openCall: (data: Partial<CallState>) => void;
  closeCall: () => void;
  setPeer: (pc: RTCPeerConnection) => void;
  minimize: () => void;
  maximize: () => void;
}

export const useCallStore = create<CallState>((set) => ({
  isOpen: false,
  isIncoming: false,
  callType: null,
  remoteUser: null,
  minimized: false,
  peerConnection: null,

  openCall: (data) => set({ isOpen: true, ...data }),
  closeCall: () =>
    set({
      isOpen: false,
      minimized: false,
      peerConnection: null,
    }),
  setPeer: (pc) => set({ peerConnection: pc }),
  minimize: () => set({ minimized: true }),
  maximize: () => set({ minimized: false }),
}));
