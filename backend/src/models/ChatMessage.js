import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    response: String,
    isAI: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      enum: [
        "eligibility",
        "registration",
        "voting",
        "timeline",
        "polling-booth",
        "general",
      ],
    },
    helpful: Boolean,
    feedback: String,
  },
  {
    timestamps: true,
  },
);

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
export default ChatMessage;
