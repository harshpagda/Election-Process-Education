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
router.post("/register", ...validateSignup, validate, asyncHandler(register));
router.post("/login", ...validateLogin, validate, asyncHandler(login));
router.post(
  "/check-eligibility",
  ...validateEligibility,
  validate,
  asyncHandler(checkVoterEligibility),
);

export default router;
