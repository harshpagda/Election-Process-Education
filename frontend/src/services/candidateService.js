import apiClient from "./api";

export const candidateService = {
  getCandidates: (electionId) =>
    apiClient.get("/candidates", { params: { electionId } }),
  getCandidate: (candidateId) => apiClient.get(`/candidates/${candidateId}`),
  createCandidate: (data) => apiClient.post("/candidates", data),
};
