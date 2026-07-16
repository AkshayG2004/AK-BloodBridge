import { Router } from "express";
import {
  createBloodRequest,
  getBloodRequests,
  acceptBloodRequest,
  completeBloodDonation,
  getMyBloodRequests,
  getAcceptedRequests,
} from "../controllers/bloodRequestController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

// ==========================
// Protected Routes
// ==========================

// Create Blood Request
router.post("/", authMiddleware, createBloodRequest);

// View All Open Blood Requests
router.get("/", authMiddleware, getBloodRequests);

router.get("/my", authMiddleware, getMyBloodRequests);

router.get("/accepted", authMiddleware, getAcceptedRequests);

// Accept Blood Request
router.put("/:id/accept", authMiddleware, acceptBloodRequest);

// Complete Blood Donation
router.put("/:id/complete", authMiddleware, completeBloodDonation);

export default router;