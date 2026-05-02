import apiClient from "./api";

export const authService = {
  register: (userData) => apiClient.post("/auth/register", userData),
  login: (email, password) =>
    apiClient.post("/auth/login", { email, password }),
  checkEligibility: (dateOfBirth, state) =>
    apiClient.post("/auth/check-eligibility", { dateOfBirth, state }),
  getProfile: () => apiClient.get("/users/profile"),
  updateProfile: (userData) => apiClient.put("/users/profile", userData),
};
