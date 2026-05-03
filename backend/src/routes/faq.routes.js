import { Router } from "express";
import {
  listFAQs,
  searchFAQ,
  getFAQDetail,
  createNewFAQ,
  updateFAQInfo,
  markHelpful,
  removeFAQ,
} from "../controllers/faq.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.js";
import { validateFAQ, validate } from "../validations/index.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

// Public routes
router.get("/", asyncHandler(listFAQs));
router.get("/search", asyncHandler(searchFAQ));
router.get("/:faqId", asyncHandler(getFAQDetail));

// Admin routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  ...validateFAQ,
  validate,
  asyncHandler(createNewFAQ),
);
router.put(
  "/:faqId",
  authMiddleware,
  adminMiddleware,
  asyncHandler(updateFAQInfo),
);
router.delete(
  "/:faqId",
  authMiddleware,
  adminMiddleware,
  asyncHandler(removeFAQ),
);

// Public feedback route
router.post("/:faqId/feedback", asyncHandler(markHelpful));

export default router;
