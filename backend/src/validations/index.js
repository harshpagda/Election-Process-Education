import { body, param, query, validationResult } from "express-validator";
import { ApiError } from "../utils/apiError.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((e) => `${e.path}: ${e.msg}`);
    throw new ApiError(400, "Validation Error", formattedErrors);
  }
  next();
};

// Auth Validations
export const validateSignup = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters"),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters"),
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("phone")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Valid 10-digit phone number is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
  body("dateOfBirth")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Valid date is required"),
  body("state")
    .optional({ values: "falsy" })
    .notEmpty()
    .withMessage("State is required"),
];

export const validateLogin = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

export const validateEligibility = [
  body("dateOfBirth")
    .isISO8601()
    .withMessage("Valid date of birth is required"),
  body("state").notEmpty().withMessage("State is required"),
  body("aadharNumber")
    .optional()
    .matches(/^\d{12}$/)
    .withMessage("Aadhar number must be 12 digits"),
];

// Election Validations
export const validateElection = [
  body("name").trim().notEmpty().withMessage("Election name is required"),
  body("type")
    .isIn(["general", "state", "local"])
    .withMessage("Invalid election type"),
  body("year")
    .isInt({ min: 2000, max: new Date().getFullYear() })
    .withMessage("Valid year is required"),
  body("state").notEmpty().withMessage("State is required"),
];

// Poll Booth Validations
export const validatePollingBooth = [
  body("boothNumber").trim().notEmpty().withMessage("Booth number is required"),
  body("name").trim().notEmpty().withMessage("Booth name is required"),
  body("state").notEmpty().withMessage("State is required"),
  body("district").trim().notEmpty().withMessage("District is required"),
  body("constituency")
    .trim()
    .notEmpty()
    .withMessage("Constituency is required"),
  body("address").trim().notEmpty().withMessage("Address is required"),
  body("coordinates").custom((value) => {
    if (!value || !value.coordinates || value.coordinates.length !== 2) {
      throw new Error("Valid coordinates are required");
    }
    return true;
  }),
];

// FAQ Validations
export const validateFAQ = [
  body("category")
    .isIn([
      "eligibility",
      "registration",
      "voting",
      "voting-rights",
      "candidates",
      "results",
      "general",
    ])
    .withMessage("Invalid category"),
  body("question").trim().notEmpty().withMessage("Question is required"),
  body("answer").trim().notEmpty().withMessage("Answer is required"),
];

// Candidate Validations
export const validateCandidate = [
  body("election").notEmpty().withMessage("Election ID is required"),
  body("name").trim().notEmpty().withMessage("Candidate name is required"),
  body("party").trim().notEmpty().withMessage("Party name is required"),
  body("symbol").trim().notEmpty().withMessage("Party symbol is required"),
  body("constituency").optional().trim(),
  body("order").optional().isInt({ min: 0 }),
];

// Vote Validations
export const validateVote = [
  body("electionId").notEmpty().withMessage("Election ID is required"),
  body("candidateId").notEmpty().withMessage("Candidate ID is required"),
];
