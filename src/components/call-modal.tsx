"use client";

import { useEffect, useState } from "react";
import {
  PhoneOff,
  Phone,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { useCallStore } from "@/store/call-store";
import { usePeer } from "@/providers/peer-context";

export default function CallModal() {
  const {
    isOpen,
    isIncoming,
    callType,
    remoteUser,
    minimized,
    closeCall,
    minimize,
    maximize,
  } = useCallStore();

  const { acceptCall, localStream, remoteStream, endCall } = usePeer();

  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Call timer
  useEffect(() => {
    if (!isOpen || isIncoming) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isIncoming]);

  if (!isOpen) return null;

  const displayName = remoteUser?.name || "User";
  const displayImage = remoteUser?.profileImage;

  return (
    <div
      className={`fixed z-50 bg-black text-white shadow-2xl transition-all duration-300 ${minimized
        ? "bottom-6 right-6 w-72 h-44 rounded-xl overflow-hidden"
        : "inset-0 flex items-center justify-center"
        }`}
    >
      <div className="relative w-full h-full flex items-center justify-center">

        {/* ===============================
           Incoming Call Screen
        =============================== */}
        {isIncoming && !minimized && (
          <div className="flex flex-col items-center gap-6">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-700">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center text-3xl font-bold">
                  {displayName[0]}
                </div>
              )}
            </div>

            <div className="text-center">
              <p className="text-xl font-semibold">{displayName}</p>
              <p className="text-gray-400 mt-1">
                Incoming {callType} call...
              </p>
            </div>

            <div className="flex gap-8 mt-4">
              <button
                onClick={endCall}
                className="bg-red-600 p-5 rounded-full hover:bg-red-700 transition"
              >
                <PhoneOff />
              </button>

              <button
                onClick={acceptCall}
                className="bg-green-600 p-5 rounded-full hover:bg-green-700 transition"
              >
                <Phone />
              </button>
            </div>
          </div>
        )}

        {/* ===============================
           Active Call Screen
        =============================== */}
        {!isIncoming && (
          <>
            {/* Remote Video / Background */}
            {callType === "video" ? (
              <video
                autoPlay
                playsInline
                ref={(video) => {
                  if (video && remoteStream) {
                    video.srcObject = remoteStream;
                  }
                }}
                className="absolute inset-0 w-full h-full object-cover"
              />

            ) : (
              <div className="flex flex-col items-center gap-6">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-700">
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-3xl font-bold">
                      {displayName[0]}
                    </div>
                  )}
                </div>
                <p className="text-xl font-semibold">{displayName}</p>
              </div>
            )}

            {/* Local Preview (Video only) */}
            {callType === "video" && !minimized && (
              <video
                autoPlay
                muted
                playsInline
                ref={(video) => {
                  if (video && localStream) {
                    video.srcObject = localStream;
                  }
                }}
                className="absolute bottom-24 right-6 w-36 h-24 rounded-lg object-cover border"
              />

            )}

            {/* Top Controls */}
            {!minimized && (
              <div className="absolute top-4 right-4">
                <button
                  onClick={minimized ? maximize : minimize}
                  className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
                >
                  {minimized ? (
                    <Maximize2 size={18} />
                  ) : (
                    <Minimize2 size={18} />
                  )}
                </button>
              </div>
            )}

            {/* Timer */}
            {!minimized && (
              <div className="absolute top-4 left-4 bg-gray-800 px-3 py-1 rounded-full text-sm">
                {Math.floor(seconds / 60)
                  .toString()
                  .padStart(2, "0")}
                :
                {(seconds % 60).toString().padStart(2, "0")}
              </div>
            )}

            {/* Bottom Controls */}
            {!minimized && (
              <div className="absolute bottom-8 flex gap-6 items-center">

                <button
                  onClick={() => setMuted(!muted)}
                  className="bg-gray-700 p-4 rounded-full hover:bg-gray-600 transition"
                >
                  {muted ? <MicOff /> : <Mic />}
                </button>

                {callType === "video" && (
                  <button
                    onClick={() => setCameraOff(!cameraOff)}
                    className="bg-gray-700 p-4 rounded-full hover:bg-gray-600 transition"
                  >
                    {cameraOff ? <VideoOff /> : <Video />}
                  </button>
                )}

                <button
                  onClick={closeCall}
                  className="bg-red-600 p-5 rounded-full hover:bg-red-700 transition"
                >
                  <PhoneOff />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
