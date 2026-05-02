import apiClient from "./api";

export const faqService = {
  getFAQs: (category, language = "en") =>
    apiClient.get("/faq", { params: { category, language } }),
  searchFAQs: (query, language = "en") =>
    apiClient.get("/faq/search", { params: { query, language } }),
  getFAQById: (faqId, language = "en") =>
    apiClient.get(`/faq/${faqId}`, { params: { language } }),
  markHelpful: (faqId, helpful) =>
    apiClient.post(`/faq/${faqId}/feedback`, { helpful }),
};
