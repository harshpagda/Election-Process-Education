import mongoose from "mongoose";
import Vote from "../models/Vote.js";
import Candidate from "../models/Candidate.js";
import Election from "../models/Election.js";
import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";

export const castVote = async ({ userId, electionId, candidateId }) => {
  const [user, election, candidate] = await Promise.all([
    User.findById(userId),
    Election.findById(electionId),
    Candidate.findById(candidateId),
  ]);

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  if (!user.isEligible) {
    throw new ApiError(403, "User is not eligible to vote");
  }

  if (!election) {
    throw new ApiError(404, "Election not found");
  }

  if (election.status !== "ongoing") {
    throw new ApiError(400, "Voting is not open for this election");
  }

  if (!candidate) {
    throw new ApiError(404, "Candidate not found");
  }

  if (candidate.election.toString() !== electionId) {
    throw new ApiError(400, "Candidate does not belong to this election");
  }

  const existingVote = await Vote.findOne({
    user: userId,
    election: electionId,
  });

  if (existingVote) {
    throw new ApiError(409, "You have already voted in this election");
  }

  const vote = await Vote.create({
    user: userId,
    election: electionId,
    candidate: candidateId,
  });

  if (!user.hasVoted) {
    user.hasVoted = true;
    await user.save();
  }

  return vote;
};

export const getVoteStatus = async ({ userId, electionId }) => {
  const vote = await Vote.findOne({
    user: userId,
    election: electionId,
  }).populate("candidate");

  if (!vote) {
    return { hasVoted: false };
  }

  return {
    hasVoted: true,
    voteId: vote._id,
    candidate: vote.candidate,
    votedAt: vote.createdAt,
  };
};

export const getElectionResults = async (electionId) => {
  if (!electionId) {
    throw new ApiError(400, "Election ID is required");
  }

  const election = await Election.findById(electionId);
  if (!election) {
    throw new ApiError(404, "Election not found");
  }

  const candidates = await Candidate.find({ election: electionId }).sort({
    order: 1,
    name: 1,
  });

  const voteBuckets = await Vote.aggregate([
    {
      $match: {
        election: new mongoose.Types.ObjectId(electionId),
      },
    },
    {
      $group: {
        _id: "$candidate",
        votes: { $sum: 1 },
      },
    },
  ]);

  const voteMap = new Map(
    voteBuckets.map((bucket) => [bucket._id.toString(), bucket.votes]),
  );

  const results = candidates.map((candidate) => ({
    ...candidate.toObject(),
    votes: voteMap.get(candidate._id.toString()) || 0,
  }));

  const totalVotes = results.reduce(
    (sum, candidate) => sum + candidate.votes,
    0,
  );

  return {
    election: election.toObject(),
    totalVotes,
    results,
  };
};
