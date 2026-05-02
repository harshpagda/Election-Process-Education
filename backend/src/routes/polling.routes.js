import { Router } from "express";
import {
  addPollingBooth,
  listPollingBooths,
  getPollingBoothDetail,
  findNearestPollingBooths,
  updatePollingBoothInfo,
  removePollingBooth,
  listBoothsByConstituency,
} from "../controllers/polling.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.js";
import { validatePollingBooth, validate } from "../validations/index.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

// Public routes
router.get("/", asyncHandler(listPollingBooths));
router.get("/nearest", asyncHandler(findNearestPollingBooths));
router.get("/by-constituency", asyncHandler(listBoothsByConstituency));
router.get("/:boothId", asyncHandler(getPollingBoothDetail));

// Admin routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  asyncHandler(validatePollingBooth),
  asyncHandler(validate),
  asyncHandler(addPollingBooth),
);
router.put(
  "/:boothId",
  authMiddleware,
  adminMiddleware,
  asyncHandler(updatePollingBoothInfo),
);
router.delete(
  "/:boothId",
  authMiddleware,
  adminMiddleware,
  asyncHandler(removePollingBooth),
);

export default router;
