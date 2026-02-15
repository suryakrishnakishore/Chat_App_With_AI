import { Laugh, Mic, Plus, Send } from "lucide-react";
import { Input } from "./ui/input";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import api from "@/lib/apiCalls";
import { useConversationStore } from "@/store/chat-store";
import { useMessageStore } from "@/store/message-store";
import { getSocket } from "@/lib/socket";
import PendingAttachmentsPreview from "./pending-attachments-preview";
import { TextArea } from "./ui/text-area";

const MessageInput = () => {
  const [msgText, setMsgText] = useState("");
  const { selectedConversation } = useConversationStore();
  const [pendingAttachments, setPendingAttachments] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSend = async () => {
    try {
      if (!selectedConversation) return;
      const chatId = selectedConversation._id;
      const participants = selectedConversation.participants;

      for (const file of pendingAttachments) {
        const form = new FormData();
        form.append("file", file);

        const uploadRes = await api.post(`/api/messages/upload/${chatId}`, form);
        const uploaded = uploadRes.data;

        const payload = {
          chatId,
          messageType: "file",
          attachments: [
            {
              url: uploaded.url,
              mimeType: uploaded.mimeType,
              size: uploaded.size,
            },
          ],
        };

        const msgRes = await api.post("/api/messages/send", payload);
        const savedMessage = msgRes.data.message;

        useMessageStore.getState().addMessage(chatId, savedMessage);

        getSocket()?.emit("message:send", {
          chatId,
          participants,
          message: savedMessage,
        });
      }

      setPendingAttachments([]);

      if (!msgText.trim()) return;

      const payload = {
        chatId,
        content: msgText,
        messageType: "text",
      };

      const res = await api.post("/api/messages/send", payload);
      const savedMessage = res.data.message;

      // Optimistic append
      useMessageStore.getState().addMessage(chatId, savedMessage);

      // Emit through socket
      const socket = getSocket();
      if (!socket) return;
      socket.emit("message:send", {
        chatId,
        participants,
        message: savedMessage,
      });


    }
    catch (err: any) {
      console.error("Send message error:", err);
    }
    finally {
      setMsgText("");
      setPendingAttachments([]);
    }
  };

  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files);

    if (selected.length + pendingAttachments.length > 5) {
      alert("You can attach a maximum of 5 files per message.");
      return;
    }

    setPendingAttachments((prev) => [...prev, ...selected]);
  };


  return (
    <div>
      <PendingAttachmentsPreview
        files={pendingAttachments}
        removeFile={
          (i) => (
            setPendingAttachments(prev => prev.filter((_, idx) => idx !== i))
          )
        }
      />
      <div className="bg-[hsl(var(--gray-primary))] px-4 py-3 flex items-center gap-4 border-t border-gray-700 shadow-inner">
        <div className="flex items-center gap-3 text-gray-500">
          <Laugh className="hover:text-[hsl(var(--green-primary))] transition-colors" />
          <Plus onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer hover:text-[hsl(var(--green-primary))]"
          />
        </div>


        <form
          className="flex items-center w-full gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!msgText.trim()) return;
            handleSend()
          }}
        >
          <input
            type="file"
            hidden
            ref={fileInputRef}
            multiple
            onChange={handleSelectFiles}
          />

          <TextArea
            placeholder="Type a message..."
            className="py-3 px-4 text-sm w-full rounded-full bg-[hsl(var(--gray-secondary))] text-[hsl(var(--foreground))] border-none focus:ring-2 focus:ring-[hsl(var(--green-primary))] transition-all"
            value={msgText}
            onChange={(e) => setMsgText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // Prevent newline
                if (msgText.trim()) {
                  handleSend();
                }
              }
            }}
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
    </div>

  );
};

export default MessageInput;
