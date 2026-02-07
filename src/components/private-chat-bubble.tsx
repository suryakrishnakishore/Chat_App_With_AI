"use client";

import Image from "next/image";

export default function PrivateChatBubble({ msg, currentUserId }: any) {
  const isMe = msg.senderId === currentUserId;

  const isImage = msg.messageType === "image";
  const isVideo = msg.messageType === "video";
  const isFile = msg.messageType === "file";

  const bubbleBase = isMe
    ? "bg-[hsl(var(--green-primary))] text-white self-end"
    : "bg-[hsl(var(--gray-secondary))] text-[hsl(var(--foreground))] self-start";

  return (
    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
      <div className={`max-w-[75%] rounded-xl p-2 shadow-md ${bubbleBase}`}>
        
        {/* TEXT MESSAGE */}
        {msg.messageType === "text" && (
          <p className="whitespace-pre-wrap break-words text-sm">
            {msg.content}
          </p>
        )}

        {/* IMAGE MESSAGE */}
        {isImage && msg.attachments?.[0] && (
          <Image
            src={msg.attachments[0].url}
            alt="attachment"
            width={250}
            height={250}
            className="rounded-lg object-cover"
          />
        )}

        {/* VIDEO MESSAGE */}
        {isVideo && msg.attachments?.[0] && (
          <video
            src={msg.attachments[0].url}
            controls
            className="rounded-lg max-w-[250px] max-h-[250px]"
          />
        )}

        {/* FILE (PDF, ZIP, DOC, etc.) */}
        {isFile && msg.attachments?.[0] && (
          <a
            href={msg.attachments[0].url}
            target="_blank"
            className="flex items-center gap-2 bg-black/20 rounded-lg p-2 text-sm hover:bg-black/30 transition"
          >
            📄 {msg.attachments[0].url.split("/").pop()}
          </a>
        )}
      </div>

      {/* TIME */}
      <span className="text-[10px] mt-1 text-gray-400">
        {new Date(msg.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
}
