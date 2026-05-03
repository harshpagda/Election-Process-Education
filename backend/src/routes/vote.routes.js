import { Router } from "express";
import {
  submitVote,
  getMyVoteStatus,
  getResults,
} from "../controllers/vote.controller.js";
import { authMiddleware } from "../middlewares/auth.js";
import { validateVote, validate } from "../validations/index.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  ...validateVote,
  validate,
  asyncHandler(submitVote),
);
router.get("/status", authMiddleware, asyncHandler(getMyVoteStatus));
router.get("/results/:electionId", asyncHandler(getResults));

export default router;
