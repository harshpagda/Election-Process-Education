import PollingBooth from "../models/PollingBooth.js";
import { ApiError } from "../utils/apiError.js";

export const createPollingBooth = async (boothData) => {
  const booth = new PollingBooth(boothData);
  await booth.save();
  return booth;
};

export const getPollingBooths = async (electionId, filters = {}) => {
  const query = { electionId };
  if (filters.state) query.state = filters.state;
  if (filters.district) query.district = filters.district;
  if (filters.constituency) query.constituency = filters.constituency;

  return await PollingBooth.find(query);
};

export const getPollingBoothById = async (boothId) => {
  const booth = await PollingBooth.findById(boothId);
  if (!booth) {
    throw new ApiError(404, "Polling booth not found");
  }
  return booth;
};

export const findNearestBooths = async (
  latitude,
  longitude,
  maxDistance = 5000,
) => {
  const booths = await PollingBooth.find({
    coordinates: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistance,
      },
    },
  });

  return booths;
};

export const updatePollingBooth = async (boothId, updateData) => {
  const booth = await PollingBooth.findByIdAndUpdate(boothId, updateData, {
    new: true,
    runValidators: true,
  });
  if (!booth) {
    throw new ApiError(404, "Polling booth not found");
  }
  return booth;
};

export const deletePollingBooth = async (boothId) => {
  const booth = await PollingBooth.findByIdAndDelete(boothId);
  if (!booth) {
    throw new ApiError(404, "Polling booth not found");
  }
  return booth;
};

export const getBoothsByConstituency = async (state, constituency) => {
  return await PollingBooth.find({ state, constituency });
};
