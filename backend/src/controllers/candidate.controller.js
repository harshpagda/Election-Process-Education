import { ApiResponse } from "../utils/apiResponse.js";
import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} from "../services/candidate.service.js";

export const listCandidates = async (req, res, next) => {
  try {
    const { electionId } = req.query;
    const candidates = await getCandidates(electionId);
    res.json(new ApiResponse(200, "Candidates fetched", candidates));
  } catch (error) {
    next(error);
  }
};

export const getCandidateDetail = async (req, res, next) => {
  try {
    const { candidateId } = req.params;
    const candidate = await getCandidateById(candidateId);
    res.json(new ApiResponse(200, "Candidate fetched", candidate));
  } catch (error) {
    next(error);
  }
};

export const createNewCandidate = async (req, res, next) => {
  try {
    const candidate = await createCandidate(req.body);
    res.status(201).json(new ApiResponse(201, "Candidate created", candidate));
  } catch (error) {
    next(error);
  }
};

export const updateCandidateInfo = async (req, res, next) => {
  try {
    const { candidateId } = req.params;
    const candidate = await updateCandidate(candidateId, req.body);
    res.json(new ApiResponse(200, "Candidate updated", candidate));
  } catch (error) {
    next(error);
  }
};

export const removeCandidate = async (req, res, next) => {
  try {
    const { candidateId } = req.params;
    await deleteCandidate(candidateId);
    res.json(new ApiResponse(200, "Candidate deleted", null));
  } catch (error) {
    next(error);
  }
};
