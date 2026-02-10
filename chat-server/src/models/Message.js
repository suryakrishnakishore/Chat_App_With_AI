import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const AttachmentSchema = new Schema(
  {
    url: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, default: null },
    thumbnail: { type: String, default: null },
    duration: { type: Number, default: null },
  },
  { _id: false }
);

const LocationSchema = new Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: { type: String, required: true },
  },
  { _id: false }
);

const MessageSchema = new Schema(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    messageType: {
      type: String,
      enum: ["text", "image", "video", "audio", "file", "location"],
      required: true,
    },

    content: { type: String, default: null },

    attachments: {
      type: [AttachmentSchema],
      default: null,
    },

    location: {
      type: LocationSchema,
      default: null,
    },

    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    forwarded: {
      type: Boolean,
      default: false,
    },

    deliveredTo: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    status: {
      type: String,
      enum: ["sent", "delivered", "read", "deleted"],
      default: "sent",
    },

    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

// Indexes
MessageSchema.index({ chatId: 1, timestamp: -1 });
MessageSchema.index({ chatId: 1, deliveredTo: 1 });
MessageSchema.index({ chatId: 1, readBy: 1 });

const Message = models.Message || model("Message", MessageSchema);

export default Message;
