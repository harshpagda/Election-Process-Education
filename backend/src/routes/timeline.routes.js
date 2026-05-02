import { Router } from "express";
import { getUpcomingDates } from "../controllers/election.controller.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

// Timeline routes
router.get("/", asyncHandler(getUpcomingDates));
router.get("/upcoming", asyncHandler(getUpcomingDates));

export default router;
