import { Router } from "express";
import {
  sendRegistrationOTP,
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getMyProfile,
  updateProfile,
  updateLocation,
  updateAvailability,
  getDonors,
  getNearbyDonors,
} from "../controllers/userController";

import authMiddleware from "../middleware/authMiddleware";

const router = Router();

// ==========================
// Public Routes
// ==========================
router.post("/send-otp", sendRegistrationOTP);

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);


// ==========================
// Protected Routes
// ==========================
router.get("/me", authMiddleware, getMyProfile);

router.put("/profile", authMiddleware, updateProfile);

router.put("/location", authMiddleware, updateLocation);

router.put("/availability", authMiddleware, updateAvailability);

// Get all available donors
router.get("/donors", authMiddleware, getDonors);

// Get nearby donors
router.get("/nearby", authMiddleware, getNearbyDonors);

export default router;