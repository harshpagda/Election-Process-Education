import { Router } from "express";
import {
  listCandidates,
  getCandidateDetail,
  createNewCandidate,
  updateCandidateInfo,
  removeCandidate,
} from "../controllers/candidate.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.js";
import { validateCandidate, validate } from "../validations/index.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

// Public routes
router.get("/", asyncHandler(listCandidates));
router.get("/:candidateId", asyncHandler(getCandidateDetail));

// Admin routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  ...validateCandidate,
  validate,
  asyncHandler(createNewCandidate),
);
router.put(
  "/:candidateId",
  authMiddleware,
  adminMiddleware,
  asyncHandler(updateCandidateInfo),
);
router.delete(
  "/:candidateId",
  authMiddleware,
  adminMiddleware,
  asyncHandler(removeCandidate),
);

export default router;
