import { Request, Response } from "express";
import User from "../models/User";
import BloodRequest from "../models/BloodRequest";
import { AuthRequest } from "../middleware/authMiddleware";

// ==========================
// Dashboard Statistics
// ==========================
export const getDashboardStats = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const [
      totalDonors,
      availableDonors,
      openRequests,
      completedDonations,
      myDonations,
      myRequests,
    ] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({
        availabilityStatus: "Available",
      }),

      BloodRequest.countDocuments({
        status: "Open",
      }),

      BloodRequest.countDocuments({
        status: "Completed",
      }),

      User.findById(req.userId).select("totalDonations"),

      BloodRequest.countDocuments({
        requester: req.userId,
      }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalDonors,
        availableDonors,
        openRequests,
        completedDonations,
        myDonations: myDonations?.totalDonations ?? 0,
        myRequests,
      },
    });

  } catch (error) {
    console.error("========== DASHBOARD ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};