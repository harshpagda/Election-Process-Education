import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import {
  getFAQs,
  searchFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  markFAQHelpful,
  deleteFAQ,
} from "../services/faq.service.js";

export const listFAQs = async (req, res, next) => {
  try {
    const { category, language = "en" } = req.query;
    const faqs = await getFAQs({ category });

    // Map to language if not English
    if (language !== "en") {
      const localizedFAQs = faqs.map((faq) => ({
        ...faq.toObject(),
        question: faq.languages?.[language]?.question || faq.question,
        answer: faq.languages?.[language]?.answer || faq.answer,
      }));
      return res.json(
        new ApiResponse(200, "FAQs fetched successfully", localizedFAQs),
      );
    }

    res.json(new ApiResponse(200, "FAQs fetched successfully", faqs));
  } catch (error) {
    next(error);
  }
};

export const searchFAQ = async (req, res, next) => {
  try {
    const { query, language = "en" } = req.query;
    if (!query) {
      throw new ApiError(400, "Search query is required");
    }

    const faqs = await searchFAQs(query, language);
    res.json(new ApiResponse(200, "FAQs searched successfully", faqs));
  } catch (error) {
    next(error);
  }
};

export const getFAQDetail = async (req, res, next) => {
  try {
    const { faqId } = req.params;
    const { language = "en" } = req.query;
    const faq = await getFAQById(faqId, language);

    res.json(new ApiResponse(200, "FAQ fetched successfully", faq));
  } catch (error) {
    next(error);
  }
};

export const createNewFAQ = async (req, res, next) => {
  try {
    const faq = await createFAQ(req.body);
    res.status(201).json(new ApiResponse(201, "FAQ created successfully", faq));
  } catch (error) {
    next(error);
  }
};

export const updateFAQInfo = async (req, res, next) => {
  try {
    const { faqId } = req.params;
    const faq = await updateFAQ(faqId, req.body);
    res.json(new ApiResponse(200, "FAQ updated successfully", faq));
  } catch (error) {
    next(error);
  }
};

export const markHelpful = async (req, res, next) => {
  try {
    const { faqId } = req.params;
    const { helpful } = req.body;

    if (typeof helpful !== "boolean") {
      throw new ApiError(400, "helpful must be a boolean");
    }

    const faq = await markFAQHelpful(faqId, helpful);
    res.json(
      new ApiResponse(200, "Feedback recorded successfully", {
        helpful: faq.helpful,
        notHelpful: faq.notHelpful,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const removeFAQ = async (req, res, next) => {
  try {
    const { faqId } = req.params;
    await deleteFAQ(faqId);
    res.json(new ApiResponse(200, "FAQ deleted successfully", null));
  } catch (error) {
    next(error);
  }
};
