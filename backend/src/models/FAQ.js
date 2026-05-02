import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
        "eligibility",
        "registration",
        "voting",
        "voting-rights",
        "candidates",
        "results",
        "general",
      ],
      required: true,
    },
    question: {
      type: String,
      required: [true, "Question is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
    keywords: [String], // for search
    languages: {
      en: {
        question: String,
        answer: String,
      },
      hi: {
        question: String,
        answer: String,
      },
      kn: {
        question: String,
        answer: String,
      },
      ml: {
        question: String,
        answer: String,
      },
      ta: {
        question: String,
        answer: String,
      },
      te: {
        question: String,
        answer: String,
      },
    },
    views: {
      type: Number,
      default: 0,
    },
    helpful: {
      type: Number,
      default: 0,
    },
    notHelpful: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const FAQ = mongoose.model("FAQ", faqSchema);
export default FAQ;
