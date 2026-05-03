import apiClient from "./api";

export const electionService = {
  getElections: (filters) => apiClient.get("/elections", { params: filters }),
  getElectionDetails: (electionId) => apiClient.get(`/elections/${electionId}`),
  getUpcomingTimelines: (state) =>
    apiClient.get("/timeline/upcoming", { params: { state } }),
  getElectionTimelines: (electionId) =>
    apiClient.get(`/timeline/${electionId}`),
  updateElection: (electionId, data) => 
    apiClient.put(`/elections/${electionId}`, data),
  addAnnouncement: (electionId, data) =>
    apiClient.post(`/elections/${electionId}/announcements`, data),
  createElection: (data) => apiClient.post("/elections", data),
};
