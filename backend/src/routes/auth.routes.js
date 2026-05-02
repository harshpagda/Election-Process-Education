import { Router } from "express";
import {
  register,
  login,
  checkVoterEligibility,
} from "../controllers/auth.controller.js";
import {
  validateSignup,
  validateLogin,
  validateEligibility,
  validate,
} from "../validations/index.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

// Public routes
router.post(
  "/register",
  asyncHandler(validateSignup),
  asyncHandler(validate),
  asyncHandler(register),
);
router.post(
  "/login",
  asyncHandler(validateLogin),
  asyncHandler(validate),
  asyncHandler(login),
);
router.post(
  "/check-eligibility",
  asyncHandler(validateEligibility),
  asyncHandler(validate),
  asyncHandler(checkVoterEligibility),
);

export default router;
