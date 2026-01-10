"use client";

export default function ChatBubble({ msg }: { msg: any }) {
  const isMe = msg.senderId === "ME"; // Replace with real userId later

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-lg shadow 
          ${isMe 
            ? "bg-blue-600 text-white rounded-br-none" 
            : "bg-gray-200 dark:bg-gray-700 dark:text-white rounded-bl-none"
          }`}
      >
        {msg.content}
      </div>
    </div>
  );
}
