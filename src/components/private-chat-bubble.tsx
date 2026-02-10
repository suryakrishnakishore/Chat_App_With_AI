"use client";

import Image from "next/image";

export default function PrivateChatBubble({ msg, currentUserId }: any) {
  const isMe = msg.senderId === currentUserId;

  const bubbleClass = isMe
    ? "bg-green-600 text-white self-end"
    : "bg-gray-300 dark:bg-gray-700 text-black dark:text-white self-start";

  return (
    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
      <div className={`max-w-[75%] rounded-xl p-2 shadow-md ${bubbleClass}`}>

        {/* Text */}
        {msg.messageType === "text" && (
          <p className="whitespace-pre-wrap break-words text-sm">
            {msg.content}
          </p>
        )}

        {/* Attachments */}
        {msg.attachments?.map((file: any, index: number) => {
          if (file.mimeType.startsWith("image/"))
            return (
              <Image
                key={index}
                src={file.url}
                width={250}
                height={200}
                alt="img"
                className="rounded-lg mt-1 object-cover"
              />
            );

          if (file.mimeType.startsWith("video/"))
            return (
              <video
                key={index}
                src={file.url}
                controls
                className="max-w-[250px] rounded-lg mt-1"
              />
            );

          return (
            <a
              key={index}
              href={file.url}
              target="_blank"
              className="flex items-center gap-2 mt-1 bg-black/20 p-2 rounded-lg text-sm hover:bg-black/30"
            >
              📄 {file.url.split("/").pop()}
            </a>
          );
        })}
      </div>

      {/* Time + Status */}
      <span className="text-[10px] mt-1 text-gray-400 flex items-center gap-1">
        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}

        {isMe && (
          <>
            {msg.status === "sent" && "✓"}
            {msg.status === "delivered" && "✓✓"}
            {msg.status === "read" && <span className="text-blue-500">✓✓</span>}
          </>
        )}
      </span>
    </div>
  );
}
