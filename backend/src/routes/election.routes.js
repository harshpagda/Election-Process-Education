import { Router } from "express";
import {
  createNewElection,
  listElections,
  getElectionDetails,
  updateElectionInfo,
  deleteElectionInfo,
  addTimeline,
  updateTimelineInfo,
  removeTimeline,
  getUpcomingDates,
} from "../controllers/election.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.js";
import { validateElection, validate } from "../validations/index.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

// Public routes
router.get("/", asyncHandler(listElections));
router.get("/upcoming", asyncHandler(getUpcomingDates));
router.get("/:electionId", asyncHandler(getElectionDetails));

// Admin routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  asyncHandler(validateElection),
  asyncHandler(validate),
  asyncHandler(createNewElection),
);
router.put(
  "/:electionId",
  authMiddleware,
  adminMiddleware,
  asyncHandler(updateElectionInfo),
);
router.delete(
  "/:electionId",
  authMiddleware,
  adminMiddleware,
  asyncHandler(deleteElectionInfo),
);

// Timeline routes
router.post(
  "/timelines",
  authMiddleware,
  adminMiddleware,
  asyncHandler(addTimeline),
);
router.put(
  "/timelines/:timelineId",
  authMiddleware,
  adminMiddleware,
  asyncHandler(updateTimelineInfo),
);
router.delete(
  "/timelines/:timelineId",
  authMiddleware,
  adminMiddleware,
  asyncHandler(removeTimeline),
);

export default router;
