import { Router } from "express";
import {
  getDashboardStats,
  getAllUsers,
  getAllRequests,
  deleteUser,
  deleteRequest,
  updateRequestStatus,
} from "../controllers/adminController";

import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";

const router = Router();

// ==========================
// Admin Routes
// ==========================
// Dashboard statistics
router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);

// Dashboard overview
router.get(
  "/dashboard/overview",
  authMiddleware,
  adminMiddleware,
);

// Get all users
router.get(
  "/users",
  authMiddleware,// Dashboard statistics
  adminMiddleware,
  getAllUsers
);

// Get all blood requests
router.get(
  "/requests",
  authMiddleware,
  adminMiddleware,
  getAllRequests
);

// Delete a user
router.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  deleteUser
);

// Delete a blood request
router.delete(
  "/requests/:id",
  authMiddleware,
  adminMiddleware,
  deleteRequest
);

router.patch(
  "/requests/:id/status",
  authMiddleware,
  adminMiddleware,
  updateRequestStatus
);

export default router;