import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema(
  {
    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
    phase: {
      type: String,
      enum: ["registration", "campaigning", "voting", "counting", "results"],
      required: true,
    },
    title: {
      type: String,
      required: [true, "Timeline title is required"],
      trim: true,
    },
    description: String,
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    importance: {
      type: String,
      enum: ["critical", "important", "info"],
      default: "info",
    },
    details: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  },
);

const Timeline = mongoose.model("Timeline", timelineSchema);
export default Timeline;
