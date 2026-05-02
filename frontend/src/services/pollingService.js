import apiClient from "./api";

export const pollingService = {
  getBooths: (electionId, filters) =>
    apiClient.get("/polling", { params: { electionId, ...filters } }),
  getBoothDetails: (boothId) => apiClient.get(`/polling/${boothId}`),
  findNearestBooths: (latitude, longitude, maxDistance = 5000) =>
    apiClient.get("/polling/nearest", {
      params: { latitude, longitude, maxDistance },
    }),
  getBoothsByConstituency: (state, constituency) =>
    apiClient.get("/polling/by-constituency", {
      params: { state, constituency },
    }),
};
