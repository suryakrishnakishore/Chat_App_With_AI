import { messages } from "@/dummyData/db";
import ChatBubble from "./chat-bubble";

const MessageContainer = () => {
  return (
    <div className="relative p-5 flex flex-col h-full bg-[hsl(var(--chat-tile-light))] dark:bg-[hsl(var(--chat-tile-dark))]">
      <div className="flex flex-col gap-4 mx-4 my-2">
        {messages?.map((msg) => (
          <ChatBubble />
        ))}
        <div id="chat-end" />
      </div>
    </div>
  );
};

export default MessageContainer;
