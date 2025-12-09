import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^.+@.+\..+$/,
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },

    gender: {
      type: enum["male", "female", "other"],

    },

    age: {
      type: Number,
      min: 0, max: 120,
      default: null
    }

    phoneNumber: {
      type: String,
      default: null,
    },

    about: {
      type: String,
      maxlength: 100,
      default: null,
    },

    roles: {
      type: [String],
      default: [],
    },

    profileImage: {
      type: String,
      default: null,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    blockedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    settings: {
      theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
      language: { type: String, default: "en" },
      fontSize: { type: String, enum: ["small", "medium", "large"], default: "medium" },
      privacy: {
        lastSeen: { type: String, enum: ["everyone", "contacts", "nobody"], default: "everyone" },
        profilePhoto: { type: String, enum: ["everyone", "contacts", "nobody"], default: "everyone" },
        readReceipts: { type: Boolean, default: true },
        aboutVisibility: { type: String, enum: ["everyone", "contacts", "nobody"], default: "everyone" },
      },
    },

    lastSeen: {
      type: Date,
      default: null,
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);
