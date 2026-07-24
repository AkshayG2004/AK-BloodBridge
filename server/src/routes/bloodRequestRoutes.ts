import { Router } from "express";
import {
  createBloodRequest,
  getBloodRequests,
  acceptBloodRequest,
  getMyBloodRequests,
  getAcceptedRequests,
  confirmDonation,
  rejectDonation,
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


// Requester confirms a donor
router.patch(
  "/:requestId/confirm/:donorId",
  authMiddleware,
  confirmDonation
);

// Requester rejects a donor
router.patch(
  "/:requestId/reject/:donorId",
  authMiddleware,
  rejectDonation
);

export default router;