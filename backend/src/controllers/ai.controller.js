import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import {
  chatWithAI,
  getChatHistory,
  saveChatFeedback,
  checkEligibilityAI,
  generateElectionInfo,
} from "../services/ai.service.js";

export const chat = async (req, res, next) => {
  try {
    const { message, language = "en" } = req.body;

    if (!message) {
      throw new ApiError(400, "Message is required");
    }

    const userId = req.user?.userId;
    const result = await chatWithAI(message, userId, language);

    res.json(new ApiResponse(200, "Chat response received", result));
  } catch (error) {
    next(error);
  }
};

export const getChatMsg = async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    const history = await getChatHistory(userId);

    res.json(new ApiResponse(200, "Chat history fetched", history));
  } catch (error) {
    next(error);
  }
};

export const provideFeedback = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { helpful, feedback } = req.body;

    if (typeof helpful !== "boolean") {
      throw new ApiError(400, "helpful must be a boolean");
    }

    const result = await saveChatFeedback(messageId, helpful, feedback);

    res.json(new ApiResponse(200, "Feedback saved successfully", result));
  } catch (error) {
    next(error);
  }
};

export const checkEligibility = async (req, res, next) => {
  try {
    const { age, state } = req.body;

    if (age === undefined || !state) {
      throw new ApiError(400, "age and state are required");
    }

    const eligibility = await checkEligibilityAI({ age, state });

    res.json(
      new ApiResponse(200, "Eligibility check completed", {
        eligibility,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const generateInfo = async (req, res, next) => {
  try {
    const { topic, language = "en" } = req.body;

    if (!topic) {
      throw new ApiError(400, "topic is required");
    }

    const info = await generateElectionInfo(topic, language);

    res.json(
      new ApiResponse(200, "Information generated", {
        topic,
        info,
      }),
    );
  } catch (error) {
    next(error);
  }
};
