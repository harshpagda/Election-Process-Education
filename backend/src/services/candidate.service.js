import Candidate from "../models/Candidate.js";
import Election from "../models/Election.js";
import { ApiError } from "../utils/apiError.js";

export const createCandidate = async (candidateData) => {
  const election = await Election.findById(candidateData.election);
  if (!election) {
    throw new ApiError(404, "Election not found");
  }

  const candidate = new Candidate(candidateData);
  await candidate.save();
  return candidate;
};

export const getCandidates = async (electionId) => {
  if (!electionId) {
    throw new ApiError(400, "Election ID is required");
  }

  return await Candidate.find({ election: electionId, isActive: true }).sort({
    order: 1,
    name: 1,
  });
};

export const getCandidateById = async (candidateId) => {
  const candidate = await Candidate.findById(candidateId);
  if (!candidate) {
    throw new ApiError(404, "Candidate not found");
  }
  return candidate;
};

export const updateCandidate = async (candidateId, updateData) => {
  const candidate = await Candidate.findByIdAndUpdate(candidateId, updateData, {
    new: true,
    runValidators: true,
  });
  if (!candidate) {
    throw new ApiError(404, "Candidate not found");
  }
  return candidate;
};

export const deleteCandidate = async (candidateId) => {
  const candidate = await Candidate.findByIdAndDelete(candidateId);
  if (!candidate) {
    throw new ApiError(404, "Candidate not found");
  }
  return candidate;
};
