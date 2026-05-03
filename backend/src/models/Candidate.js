import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Candidate name is required"],
      trim: true,
    },
    party: {
      type: String,
      required: [true, "Party name is required"],
      trim: true,
    },
    symbol: {
      type: String,
      required: [true, "Party symbol is required"],
      trim: true,
    },
    constituency: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Candidate = mongoose.model("Candidate", candidateSchema);
export default Candidate;
