import express from "express";

import {
  getProfile,
  updateProfile,
} from "../controllers/profileController";

import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();
console.log("Profile Routes Loaded");

// Get Logged-in User Profile
router.get(
  "/",
  authMiddleware,
  getProfile
);

router.put(
  "/",
  authMiddleware,
  updateProfile
);

export default router;