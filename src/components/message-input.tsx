import { Laugh, Mic, Plus, Send } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";
import { Button } from "./ui/button";
import api from "@/lib/apiCalls";
import { useConversationStore } from "@/store/chat-store";
import { useMessageStore } from "@/store/message-store";
import { getSocket } from "@/lib/socket";

const MessageInput = () => {
  const [msgText, setMsgText] = useState("");
  const { selectedConversation } = useConversationStore();

  const handleSend = async () => {
    if (!msgText.trim() || !selectedConversation) return;

    const chatId = selectedConversation._id;

    const payload = {
      chatId,
      content: msgText,
      messageType: "text",
    };

    // First send to REST
    const res = await api.post("/api/messages/send", payload);
    const savedMessage = res.data.message;

    // Optimistic append
    useMessageStore.getState().addMessage(chatId, savedMessage);

    // Emit through socket
    const socket = getSocket();
    socket.emit("message:send", {
      chatId,
      message: savedMessage,
    });

    setMsgText("");
  };

  return (
    <div className="bg-[hsl(var(--gray-primary))] px-4 py-3 flex items-center gap-4 border-t border-gray-700 shadow-inner">
      <div className="flex items-center gap-3 text-gray-500">
        <Laugh className="hover:text-[hsl(var(--green-primary))] transition-colors" />
        <Plus className="hover:text-[hsl(var(--green-primary))] transition-colors" />
      </div>

      <form
        className="flex items-center w-full gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!msgText.trim()) return;
          handleSend()
        }}
      >
        <Input
          type="text"
          placeholder="Type a message..."
          className="py-3 px-4 text-sm w-full rounded-full bg-[hsl(var(--gray-secondary))] text-[hsl(var(--foreground))] border-none focus:ring-2 focus:ring-[hsl(var(--green-primary))] transition-all"
          value={msgText}
          onChange={(e) => setMsgText(e.target.value)}
        />
        <div className="flex items-center">
          <Button
            type="submit"
            size="icon"
            className="rounded-full p-2 bg-[hsl(var(--green-primary))] hover:bg-[hsl(var(--green-hover))] text-white shadow-md transition-all"
          >
            {msgText.length > 0 ? <Send size={18} /> : <Mic size={18} />}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
