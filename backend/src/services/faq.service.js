import FAQ from "../models/FAQ.js";
import { ApiError } from "../utils/apiError.js";

export const createFAQ = async (faqData) => {
  const faq = new FAQ(faqData);
  await faq.save();
  return faq;
};

export const getFAQs = async (filters = {}) => {
  const query = { isPublished: true };
  if (filters.category) query.category = filters.category;

  return await FAQ.find(query).sort({ createdAt: -1 });
};

export const searchFAQs = async (searchQuery, language = "en") => {
  const FAQs = await FAQ.find({
    isPublished: true,
    $or: [
      { keywords: { $in: [searchQuery.toLowerCase()] } },
      { question: { $regex: searchQuery, $options: "i" } },
    ],
  });

  // Map to language-specific content
  return FAQs.map((faq) => ({
    _id: faq._id,
    category: faq.category,
    question: faq.languages[language]?.question || faq.question,
    answer: faq.languages[language]?.answer || faq.answer,
    views: faq.views,
    helpful: faq.helpful,
    notHelpful: faq.notHelpful,
  }));
};

export const getFAQById = async (faqId, language = "en") => {
  const faq = await FAQ.findById(faqId);
  if (!faq) {
    throw new ApiError(404, "FAQ not found");
  }

  // Update views
  faq.views = (faq.views || 0) + 1;
  await faq.save();

  return {
    ...faq.toObject(),
    question: faq.languages[language]?.question || faq.question,
    answer: faq.languages[language]?.answer || faq.answer,
  };
};

export const updateFAQ = async (faqId, updateData) => {
  const faq = await FAQ.findByIdAndUpdate(faqId, updateData, {
    new: true,
    runValidators: true,
  });
  if (!faq) {
    throw new ApiError(404, "FAQ not found");
  }
  return faq;
};

export const markFAQHelpful = async (faqId, isHelpful) => {
  const faq = await FAQ.findById(faqId);
  if (!faq) {
    throw new ApiError(404, "FAQ not found");
  }

  if (isHelpful) {
    faq.helpful = (faq.helpful || 0) + 1;
  } else {
    faq.notHelpful = (faq.notHelpful || 0) + 1;
  }

  await faq.save();
  return faq;
};

export const deleteFAQ = async (faqId) => {
  const faq = await FAQ.findByIdAndDelete(faqId);
  if (!faq) {
    throw new ApiError(404, "FAQ not found");
  }
  return faq;
};
