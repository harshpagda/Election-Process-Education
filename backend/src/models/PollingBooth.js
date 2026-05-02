import mongoose from "mongoose";

const pollingBoothSchema = new mongoose.Schema(
  {
    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
    boothNumber: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: [true, "Polling booth name is required"],
    },
    state: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    constituency: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    votingTime: {
      startTime: {
        type: String, // HH:MM format
        default: "07:00",
      },
      endTime: {
        type: String, // HH:MM format
        default: "18:00",
      },
    },
    accessibilityFeatures: [String], // e.g., "wheelchair_access", "braille_signage"
    facilities: [String], // e.g., "parking", "water", "rest_area"
    capacity: Number,
    contact: String,
  },
  {
    timestamps: true,
  },
);

// Create geospatial index
pollingBoothSchema.index({ coordinates: "2dsphere" });

const PollingBooth = mongoose.model("PollingBooth", pollingBoothSchema);
export default PollingBooth;
