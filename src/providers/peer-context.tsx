import { getSocket } from "@/lib/socket";
import { useCallStore } from "@/store/call-store";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface PeerContextType {
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    incomingOfferRef: any,
    startCall: (remoteId: string, callType: "audio" | "video") => Promise<void>;
    acceptCall: (offer: RTCSessionDescriptionInit, from: string) => Promise<void>;
    endCall: () => void;
}

const PeerContext = React.createContext<PeerContextType | null>(null);

export const usePeer = () => React.useContext(PeerContext);

export const PeerProvider = (props: any) => {
    const { openCall, closeCall } = useCallStore();
    const peerRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const remoteUserRef = useRef<string | null>(null);

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

    const incomingOfferRef = useRef<any>(null)
    const socket = getSocket();

    const createPeer = () => {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:global.stun.twilio.com:3478"
                    ]
                }
            ]
        });

        peer.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        };

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socket?.emit("call:ice-candidate", {
                    to: remoteUserRef.current,
                    candidate: event.candidate
                });
            }
        }

        peerRef.current = peer;
        return peer;
    }

    const startCall = async (remoteId: string, callType: "audio" | "video") => {
        openCall({
            isIncoming: false,
            callType,
            remoteUser: { _id: remoteId },
        });
        remoteUserRef.current = remoteId;

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

    const acceptCall = async () => {
        const offer = incomingOfferRef.current;

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
            to: remoteUserRef.current,
            answer,
        });

        openCall({
            isIncoming: false,
        });
    };

    const endCall = () => {
        if(remoteUserRef.current) {
            socket?.emit("call:end", {
                to: remoteUserRef.current
            })
        }
        localStreamRef.current?.getTracks().forEach((t) => t.stop());
        peerRef.current?.close();
        peerRef.current = null;

        setLocalStream(null);
        setRemoteStream(null);

        remoteUserRef.current = null;

        closeCall();
    };

    useEffect(() => {
        if (!socket) return;

        socket.on("call:incoming", async ({ from, offer, callType }) => {
            remoteUserRef.current = from;

            openCall({
                isIncoming: true,
                callType,
                remoteUser: { _id: from },
            });

            incomingOfferRef.current = offer;
        });

        socket.on("call:answer", async ({ answer }) => {
            await peerRef.current?.setRemoteDescription(
                new RTCSessionDescription(answer)
            );
        });

        socket.on("call:ice-candidate", async ({ candidate }) => {
            await peerRef.current?.addIceCandidate(
                new RTCIceCandidate(candidate)
            );
        });

        socket.on("call:end", () => {
            endCall();
        });

        return () => {
            socket.off("call:incoming");
            socket.off("call:answer");
            socket.off("call:ice-candidate");
            socket.off("call:end");
        };
    }, []);

    return (
        <PeerContext.Provider value={{ localStream, remoteStream, incomingOfferRef, startCall, acceptCall, endCall }}>
            {props.children}
        </PeerContext.Provider>
    )
}