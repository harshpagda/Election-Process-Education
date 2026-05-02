import apiClient from "./api";

export const aiService = {
  chat: (message, language = "en") =>
    apiClient.post("/ai/chat", { message, language }),
  checkEligibility: (age, state) =>
    apiClient.post("/ai/check-eligibility", { age, state }),
  generateInfo: (topic, language = "en") =>
    apiClient.post("/ai/generate-info", { topic, language }),
  getChatHistory: () => apiClient.get("/ai/history"),
  provideFeedback: (messageId, helpful, feedback) =>
    apiClient.post(`/ai/feedback/${messageId}`, { helpful, feedback }),
};
