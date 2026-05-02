import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import {
  createPollingBooth,
  getPollingBooths,
  getPollingBoothById,
  findNearestBooths,
  updatePollingBooth,
  deletePollingBooth,
  getBoothsByConstituency,
} from "../services/polling.service.js";

export const addPollingBooth = async (req, res, next) => {
  try {
    const booth = await createPollingBooth(req.body);
    res
      .status(201)
      .json(new ApiResponse(201, "Polling booth created successfully", booth));
  } catch (error) {
    next(error);
  }
};

export const listPollingBooths = async (req, res, next) => {
  try {
    const { electionId, state, district, constituency } = req.query;

    if (!electionId) {
      throw new ApiError(400, "electionId is required");
    }

    const booths = await getPollingBooths(electionId, {
      state,
      district,
      constituency,
    });

    res.json(
      new ApiResponse(200, "Polling booths fetched successfully", booths),
    );
  } catch (error) {
    next(error);
  }
};

export const getPollingBoothDetail = async (req, res, next) => {
  try {
    const { boothId } = req.params;
    const booth = await getPollingBoothById(boothId);

    res.json(new ApiResponse(200, "Polling booth details fetched", booth));
  } catch (error) {
    next(error);
  }
};

export const findNearestPollingBooths = async (req, res, next) => {
  try {
    const { latitude, longitude, maxDistance = 5000 } = req.query;

    if (!latitude || !longitude) {
      throw new ApiError(400, "latitude and longitude are required");
    }

    const booths = await findNearestBooths(
      parseFloat(latitude),
      parseFloat(longitude),
      parseInt(maxDistance),
    );

    res.json(new ApiResponse(200, "Nearest polling booths found", booths));
  } catch (error) {
    next(error);
  }
};

export const updatePollingBoothInfo = async (req, res, next) => {
  try {
    const { boothId } = req.params;
    const booth = await updatePollingBooth(boothId, req.body);

    res.json(new ApiResponse(200, "Polling booth updated successfully", booth));
  } catch (error) {
    next(error);
  }
};

export const removePollingBooth = async (req, res, next) => {
  try {
    const { boothId } = req.params;
    await deletePollingBooth(boothId);

    res.json(new ApiResponse(200, "Polling booth deleted successfully", null));
  } catch (error) {
    next(error);
  }
};

export const listBoothsByConstituency = async (req, res, next) => {
  try {
    const { state, constituency } = req.query;

    if (!state || !constituency) {
      throw new ApiError(400, "state and constituency are required");
    }

    const booths = await getBoothsByConstituency(state, constituency);

    res.json(
      new ApiResponse(200, "Polling booths by constituency fetched", booths),
    );
  } catch (error) {
    next(error);
  }
};
