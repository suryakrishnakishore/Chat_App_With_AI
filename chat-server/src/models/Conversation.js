import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const ConversationSchema = new Schema(
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
  model("Conversation", ConversationSchema);
