import { ApiResponse } from "../utils/apiResponse.js";
import {
  castVote,
  getVoteStatus,
  getElectionResults,
} from "../services/vote.service.js";
import Election from "../models/Election.js";
import { ApiError } from "../utils/apiError.js";

export const submitVote = async (req, res, next) => {
  try {
    const { electionId, candidateId } = req.body;
    const vote = await castVote({
      userId: req.user.userId,
      electionId,
      candidateId,
    });

    res.status(201).json(new ApiResponse(201, "Vote recorded", vote));
  } catch (error) {
    next(error);
  }
};

export const getMyVoteStatus = async (req, res, next) => {
  try {
    const { electionId } = req.query;
    const status = await getVoteStatus({
      userId: req.user.userId,
      electionId,
    });

    res.json(new ApiResponse(200, "Vote status fetched", status));
  } catch (error) {
    next(error);
  }
};

export const getResults = async (req, res, next) => {
  try {
    const { electionId } = req.params;
    
    // Fetch election to check if results are declared
    const election = await Election.findById(electionId);
    if (!election) {
      throw new ApiError(404, "Election not found");
    }

    if (!election.resultsDeclared && req.user?.role !== "admin") {
      throw new ApiError(403, "Results have not been declared for this election yet.");
    }

    const results = await getElectionResults(electionId);
    res.json(new ApiResponse(200, "Election results fetched", results));
  } catch (error) {
    next(error);
  }
};
