import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  getUserNotifications,
  updateNotificationPreferences,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

// Protected routes
router.get("/profile", authMiddleware, asyncHandler(getUserProfile));
router.put("/profile", authMiddleware, asyncHandler(updateUserProfile));
router.get(
  "/notifications",
  authMiddleware,
  asyncHandler(getUserNotifications),
);
router.put(
  "/preferences",
  authMiddleware,
  asyncHandler(updateNotificationPreferences),
);

export default router;
