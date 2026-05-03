import { Router } from "express";
import {
  getUpcomingDates,
  getElectionTimelines,
} from "../controllers/election.controller.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

// Timeline routes
router.get("/", asyncHandler(getUpcomingDates));
router.get("/upcoming", asyncHandler(getUpcomingDates));
router.get("/:electionId", asyncHandler(getElectionTimelines));

export default router;
