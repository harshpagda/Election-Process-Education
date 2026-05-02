import { Router } from "express";
import {
  chat,
  getChatMsg,
  provideFeedback,
  checkEligibility,
  generateInfo,
} from "../controllers/ai.controller.js";
import { authMiddleware } from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

// Public routes
router.post("/chat", asyncHandler(chat));
router.post("/check-eligibility", asyncHandler(checkEligibility));
router.post("/generate-info", asyncHandler(generateInfo));

// Protected routes
router.get("/history", authMiddleware, asyncHandler(getChatMsg));
router.post(
  "/feedback/:messageId",
  authMiddleware,
  asyncHandler(provideFeedback),
);

export default router;
