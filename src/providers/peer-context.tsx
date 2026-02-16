import { getSocket } from "@/lib/socket";
import React, { useMemo, useRef, useState } from "react";

interface PeerContextType {
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    startCall: (remoteId: string, callType: "audio" | "video") => Promise<void>;
    acceptCall: (offer: RTCSessionDescriptionInit, from: string) => Promise<void>;
    endCall: () => void;
}

const PeerContext = React.createContext<PeerContextType | null>(null);

export const usePeer = () => React.useContext(PeerContext);

export const PeerProvider = (props: any) => {
    const peerRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

    const socket = getSocket();

    const createPeer = () => {
        const peer = useMemo(() => new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:global.stun.twilio.com:3478"
                    ]
                }
            ]
        }), []);

        peer.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        };

        peer.onicecandidate = (event) => {
            if(event.candidate) {
                socket?.emit("call:ice-candidate", {
                    candidate: event.candidate
                });
            }
        }

        peerRef.current = peer;
        return peer;
    }

    const startCall = async (remoteId: string, callType: "audio" | "video") => {
        const peer = createPeer();

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: callType === "video",
        });

        localStreamRef.current = stream;
        setLocalStream(stream);

        stream.getTracks().forEach((track) =>
            peer.addTrack(track, stream)
        );

        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);

        socket?.emit("call:offer", {
            to: remoteId,
            offer,
            callType,
        });
    };

    const acceptCall = async (
    offer: RTCSessionDescriptionInit,
    from: string
  ) => {
    const peer = createPeer();

    await peer.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    localStreamRef.current = stream;
    setLocalStream(stream);

    stream.getTracks().forEach((track) =>
      peer.addTrack(track, stream)
    );

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket?.emit("call:answer", {
      to: from,
      answer,
    });
  };

  const endCall = () => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    peerRef.current?.close();

    setLocalStream(null);
    setRemoteStream(null);
  };

    return (
        <PeerContext.Provider value={{ localStream, remoteStream, startCall, acceptCall, endCall }}>
            {props.children}
        </PeerContext.Provider>
    )
}