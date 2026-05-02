import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import {
  createElection,
  getElections,
  getElectionById,
  updateElection,
  deleteElection,
  getTimelineByElection,
  createTimeline,
  updateTimeline,
  deleteTimeline,
  getUpcomingEvents,
} from "../services/election.service.js";

export const createNewElection = async (req, res, next) => {
  try {
    const election = await createElection(req.body);
    res
      .status(201)
      .json(new ApiResponse(201, "Election created successfully", election));
  } catch (error) {
    next(error);
  }
};

export const listElections = async (req, res, next) => {
  try {
    const { type, state, status } = req.query;
    const elections = await getElections({ type, state, status });
    res.json(new ApiResponse(200, "Elections fetched successfully", elections));
  } catch (error) {
    next(error);
  }
};

export const getElectionDetails = async (req, res, next) => {
  try {
    const { electionId } = req.params;
    const election = await getElectionById(electionId);
    const timelines = await getTimelineByElection(electionId);

    res.json(
      new ApiResponse(200, "Election details fetched", {
        election,
        timelines,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const updateElectionInfo = async (req, res, next) => {
  try {
    const { electionId } = req.params;
    const election = await updateElection(electionId, req.body);
    res.json(new ApiResponse(200, "Election updated successfully", election));
  } catch (error) {
    next(error);
  }
};

export const deleteElectionInfo = async (req, res, next) => {
  try {
    const { electionId } = req.params;
    await deleteElection(electionId);
    res.json(new ApiResponse(200, "Election deleted successfully", null));
  } catch (error) {
    next(error);
  }
};

// Timeline endpoints
export const addTimeline = async (req, res, next) => {
  try {
    const timeline = await createTimeline(req.body);
    res
      .status(201)
      .json(new ApiResponse(201, "Timeline created successfully", timeline));
  } catch (error) {
    next(error);
  }
};

export const updateTimelineInfo = async (req, res, next) => {
  try {
    const { timelineId } = req.params;
    const timeline = await updateTimeline(timelineId, req.body);
    res.json(new ApiResponse(200, "Timeline updated successfully", timeline));
  } catch (error) {
    next(error);
  }
};

export const removeTimeline = async (req, res, next) => {
  try {
    const { timelineId } = req.params;
    await deleteTimeline(timelineId);
    res.json(new ApiResponse(200, "Timeline deleted successfully", null));
  } catch (error) {
    next(error);
  }
};

export const getUpcomingDates = async (req, res, next) => {
  try {
    const { state } = req.query;
    const events = await getUpcomingEvents(state);
    res.json(new ApiResponse(200, "Upcoming events fetched", events));
  } catch (error) {
    next(error);
  }
};
