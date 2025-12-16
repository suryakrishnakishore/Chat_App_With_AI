import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ILastMessage {
  messageId: mongoose.Types.ObjectId;
  content: string | null;
  messageType: "text" | "image" | "video" | "audio" | "file" | "location" | "contact";
  timestamp: Date;
  senderId: mongoose.Types.ObjectId;
}

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  chatType: "private" | "group" | "channel";
  chatName?: string | null;
  chatImage?: string | null;
  lastMessage?: ILastMessage | null;
  settings?: {
    isGroupJoinApprovalRequired?: boolean | null;
    allowForwarding?: boolean | null;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    chatType: { type: String, enum: ["private", "group", "channel"], required: true },

    chatName: { type: String, default: null },
    chatImage: { type: String, default: null },

    lastMessage: {
      messageId: { type: Schema.Types.ObjectId },
      content: { type: String, default: null },
      messageType: {
        type: String,
        enum: ["text", "image", "video", "audio", "file", "location", "contact"],
      },
      timestamp: { type: Date },
      senderId: { type: Schema.Types.ObjectId, ref: "User" },
    },

    settings: {
      isGroupJoinApprovalRequired: { type: Boolean, default: null },
      allowForwarding: { type: Boolean, default: null },
    },
  },
  { timestamps: true }
);

export default models.Conversation || model<IConversation>("Conversation", ConversationSchema);
