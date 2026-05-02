import mongoose from "mongoose";

const electionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Election name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["general", "state", "local"],
      required: true,
    },
    year: {
      type: Number,
      required: [true, "Election year is required"],
    },
    state: {
      type: String,
      enum: [
        "All",
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal",
      ],
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
    description: String,
    totalConstituencies: Number,
    totalElectors: Number,
    totalCandidates: Number,
    image: String,
  },
  {
    timestamps: true,
  },
);

const Election = mongoose.model("Election", electionSchema);
export default Election;
