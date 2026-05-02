import Election from "../models/Election.js";
import Timeline from "../models/Timeline.js";
import { ApiError } from "../utils/apiError.js";

export const createElection = async (electionData) => {
  const election = new Election(electionData);
  await election.save();
  return election;
};

export const getElections = async (filters = {}) => {
  const query = {};
  if (filters.type) query.type = filters.type;
  if (filters.state && filters.state !== "All") query.state = filters.state;
  if (filters.status) query.status = filters.status;

  return await Election.find(query).sort({ year: -1 });
};

export const getElectionById = async (electionId) => {
  const election = await Election.findById(electionId);
  if (!election) {
    throw new ApiError(404, "Election not found");
  }
  return election;
};

export const updateElection = async (electionId, updateData) => {
  const election = await Election.findByIdAndUpdate(electionId, updateData, {
    new: true,
    runValidators: true,
  });
  if (!election) {
    throw new ApiError(404, "Election not found");
  }
  return election;
};

export const deleteElection = async (electionId) => {
  const election = await Election.findByIdAndDelete(electionId);
  if (!election) {
    throw new ApiError(404, "Election not found");
  }
  return election;
};

export const getTimelineByElection = async (electionId) => {
  const timelines = await Timeline.find({ election: electionId }).sort({
    startDate: 1,
  });
  return timelines;
};

export const createTimeline = async (timelineData) => {
  const timeline = new Timeline(timelineData);
  await timeline.save();
  return timeline;
};

export const updateTimeline = async (timelineId, updateData) => {
  const timeline = await Timeline.findByIdAndUpdate(timelineId, updateData, {
    new: true,
    runValidators: true,
  });
  if (!timeline) {
    throw new ApiError(404, "Timeline not found");
  }
  return timeline;
};

export const deleteTimeline = async (timelineId) => {
  const timeline = await Timeline.findByIdAndDelete(timelineId);
  if (!timeline) {
    throw new ApiError(404, "Timeline not found");
  }
  return timeline;
};

export const getUpcomingEvents = async (state) => {
  const query = {
    startDate: { $gte: new Date() },
    importance: { $in: ["critical", "important"] },
  };
  if (state) query.state = state;

  return await Timeline.find(query)
    .populate("election")
    .sort({ startDate: 1 })
    .limit(10);
};
