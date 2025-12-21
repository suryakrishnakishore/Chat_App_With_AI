import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IAttachment {
  url: string;
  mimeType: string;
  size?: number | null;
  thumbnail?: string | null;
  duration?: number | null;
}

export interface ILocation {
  lat: number;
  lng: number;
  name: string;
}

export interface IMessage extends Document {
  chatId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  receiverId?: mongoose.Types.ObjectId | null;

  messageType: "text" | "image" | "video" | "audio" | "file" | "location";

  content?: string | null;

  attachments?: IAttachment[] | null;
  location?: ILocation | null;

  replyTo?: mongoose.Types.ObjectId | null;
  forwarded: boolean;

  deliveredTo?: mongoose.Types.ObjectId[] | null;
  readBy?: mongoose.Types.ObjectId[] | null;

  status: "sent" | "delivered" | "read" | "deleted";

  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AttachmentSchema = new Schema<IAttachment>(
  {
    url: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, default: null },
    thumbnail: { type: String, default: null },
    duration: { type: Number, default: null },
  },
  { _id: false }
);

const LocationSchema = new Schema<ILocation>(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: { type: String, required: true },
  },
  { _id: false }
);

const MessageSchema = new Schema<IMessage>(
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

MessageSchema.index({ chatId: 1, timestamp: -1 });
MessageSchema.index({ chatId: 1, deliveredTo: 1 });
MessageSchema.index({ chatId: 1, readBy: 1 });

export default models.Message || model<IMessage>("Message", MessageSchema);
