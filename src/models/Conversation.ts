import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ILastMessage {
  messageId: mongoose.Types.ObjectId;
  content: string | null;
  messageType:
    | "text"
    | "image"
    | "video"
    | "audio"
    | "file"
    | "location"
    | "contact";
  timestamp: Date;
  senderId: mongoose.Types.ObjectId;
}

export interface IConversation extends Document {
  chatType: "private" | "group" | "channel";

  participants: mongoose.Types.ObjectId[];

  // Group only
  chatName?: string | null;
  chatImage?: string | null;
  description?: string | null;

  admins?: mongoose.Types.ObjectId[];        // group admins
  createdBy?: mongoose.Types.ObjectId;       // group creator

  joinRequests?: mongoose.Types.ObjectId[];  // optional feature

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
    chatType: {
      type: String,
      enum: ["private", "group", "channel"],
      required: true,
    },

    // Private: 2 users
    // Group: 2+ participants
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],

    // Group / Channel-specific fields
    chatName: { type: String, default: null },
    chatImage: { type: String, default: null },
    description: { type: String, default: null },

    admins: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },

    joinRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],

    lastMessage: {
      messageId: { type: Schema.Types.ObjectId, ref: "Message" },
      content: { type: String, default: null },
      messageType: {
        type: String,
        enum: [
          "text",
          "image",
          "video",
          "audio",
          "file",
          "location",
          "contact",
        ],
      },
      timestamp: { type: Date },
      senderId: { type: Schema.Types.ObjectId, ref: "User" },
    },

    settings: {
      isGroupJoinApprovalRequired: { type: Boolean, default: false },
      allowForwarding: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default models.Conversation ||
  model<IConversation>("Conversation", ConversationSchema);
