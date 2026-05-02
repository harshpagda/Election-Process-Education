import OpenAI from "openai";
import { config } from "../config/env.js";
import ChatMessage from "../models/ChatMessage.js";
import FAQ from "../models/FAQ.js";
import { ApiError } from "../utils/apiError.js";

const getOpenAIClient = () => {
  if (!config.OPENAI_API_KEY) {
    return null;
  }

  return new OpenAI({
    apiKey: config.OPENAI_API_KEY,
  });
};

const SYSTEM_PROMPT = `You are an AI assistant specialized in helping Indian citizens understand the election process. 
You provide accurate, simple, and easy-to-understand information about:
- Voter eligibility and registration
- Voting process and procedures
- Election timelines and important dates
- Rights and responsibilities of voters
- Finding polling booths
- General election-related questions

Always respond in simple language, avoiding legal jargon. If you don't know something, be honest and suggest they check official sources.
Respond in the language the user is using.`;

export const chatWithAI = async (message, userId, language = "en") => {
  try {
    const openai = getOpenAIClient();

    // Check if question is in FAQ database first
    const relevantFAQs = await FAQ.find({
      isPublished: true,
      keywords: {
        $in: [message.toLowerCase().split(" ").slice(0, 3).join(" ")],
      },
    }).limit(3);

    let context = "";
    if (relevantFAQs.length > 0) {
      context = `Here are some relevant FAQs:\n${relevantFAQs
        .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
        .join("\n\n")}\n\n`;
    }

    if (!openai) {
      const fallbackResponse =
        relevantFAQs.length > 0
          ? `${context}OpenAI is not configured right now, so I am showing you relevant FAQ guidance instead.`
          : "OpenAI is not configured on this server right now. Please add OPENAI_API_KEY to enable AI chat, or use the FAQ section for guidance.";

      if (userId) {
        const chatMessage = new ChatMessage({
          user: userId,
          message,
          response: fallbackResponse,
          isAI: true,
        });
        await chatMessage.save();
      }

      return {
        message,
        response: fallbackResponse,
        sources: relevantFAQs.map((f) => ({
          id: f._id,
          question: f.question,
          category: f.category,
        })),
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `${SYSTEM_PROMPT}\n${context}You are responding in ${language} language.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = response.choices[0].message.content;

    // Save chat message
    if (userId) {
      const chatMessage = new ChatMessage({
        user: userId,
        message,
        response: aiResponse,
        isAI: true,
      });
      await chatMessage.save();
    }

    return {
      message,
      response: aiResponse,
      sources: relevantFAQs.map((f) => ({
        id: f._id,
        question: f.question,
        category: f.category,
      })),
    };
  } catch (error) {
    console.error("AI Chat error:", error);
    throw new ApiError(500, "Failed to process chat request");
  }
};

export const getChatHistory = async (userId, limit = 20) => {
  return await ChatMessage.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("-user");
};

export const saveChatFeedback = async (messageId, isHelpful, feedback) => {
  const message = await ChatMessage.findByIdAndUpdate(
    messageId,
    { helpful: isHelpful, feedback },
    { new: true },
  );
  if (!message) {
    throw new ApiError(404, "Message not found");
  }
  return message;
};

// Knowledge base: Eligibility checker
export const checkEligibilityAI = async (userInfo) => {
  const openai = getOpenAIClient();

  if (!openai) {
    return "OpenAI is not configured on this server right now. Based on the information provided, please verify your age and voter registration details with the official election authority.";
  }

  const prompt = `Based on the following information about an Indian voter, determine their eligibility to vote:
- Age: ${userInfo.age}
- State: ${userInfo.state}
- Citizenship: Indian

Provide a clear answer about their eligibility and any relevant information about voter registration.`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an expert on Indian election law and voter eligibility. Provide accurate information.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.5,
    max_tokens: 300,
  });

  return response.choices[0].message.content;
};

// Generate election information dynamically
export const generateElectionInfo = async (topic, language = "en") => {
  const openai = getOpenAIClient();

  if (!openai) {
    return `OpenAI is not configured on this server right now. Please check the FAQ or official election sources for information about ${topic}.`;
  }

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `${SYSTEM_PROMPT}\nRespond in ${language} language.`,
      },
      {
        role: "user",
        content: `Provide detailed but simple information about: ${topic}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  return response.choices[0].message.content;
};
