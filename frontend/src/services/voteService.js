import apiClient from "./api";

export const voteService = {
  castVote: (electionId, candidateId) =>
    apiClient.post("/votes", { electionId, candidateId }),
  getStatus: (electionId) =>
    apiClient.get("/votes/status", { params: { electionId } }),
  getResults: (electionId) => apiClient.get(`/votes/results/${electionId}`),
};
