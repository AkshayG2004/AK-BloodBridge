import { Response } from "express";
import User from "../models/User";
import BloodRequest from "../models/BloodRequest";
import { AuthRequest } from "../middleware/authMiddleware";

const MS_IN_DAY = 1000 * 60 * 60 * 24;
const ELIGIBILITY_GAP_DAYS = 90;

// ==========================
// Dashboard Statistics
// ==========================
export const getDashboardStats = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const user = await User.findById(req.userId).select(
      "name bloodGroup city weight totalDonations availabilityStatus lastDonationDate"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const [
      totalDonors,
      availableDonors,
      registeredCityDonors,
      availableCityDonors,
      openRequests,
      completedDonations,
      myRequests,
      requestsFulfilled,
      bloodGroupAgg,
      availabilityAgg,
      cityAgg,
    ] = await Promise.all([

      User.countDocuments(),

      User.countDocuments({
        availabilityStatus: "Available",
      }),

      User.countDocuments({
        city: user.city,
      }),

      User.countDocuments({
        city: user.city,
        availabilityStatus: "Available",
      }),

      BloodRequest.countDocuments({
        status: "Open",
      }),

      BloodRequest.countDocuments({
        status: "Completed",
      }),

      BloodRequest.countDocuments({
        requester: req.userId,
      }),

      // NOTE: assumes BloodRequest has a "donor" field set when a
      // donor fulfills a request. Update the field name below if
      // your schema tracks this differently.
      BloodRequest.countDocuments({
        donor: req.userId,
        status: "Completed",
      }),

      User.aggregate([
        { $group: { _id: "$bloodGroup", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      User.aggregate([
        { $group: { _id: "$availabilityStatus", count: { $sum: 1 } } },
      ]),

      User.aggregate([
        { $group: { _id: "$city", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),

    ]);

    // ===== Derived personal stats =====

    const myDonations = user.totalDonations ?? 0;
    const livesImpacted = myDonations * 3;

    let eligibleAgainDate: Date | null = null;
    let isEligibleNow = true;

    if (user.lastDonationDate) {
      const next = new Date(user.lastDonationDate);
      next.setDate(next.getDate() + ELIGIBILITY_GAP_DAYS);
      const daysLeft = Math.ceil((next.getTime() - Date.now()) / MS_IN_DAY);
      if (daysLeft > 0) {
        eligibleAgainDate = next;
        isEligibleNow = false;
      }
    }

    // ===== Format aggregation results =====

    const bloodGroupDistribution = bloodGroupAgg.map((g) => ({
      group: g._id ?? "Unknown",
      count: g.count,
    }));

    const availabilityDistribution = availabilityAgg.map((a) => ({
      status: a._id ?? "Unknown",
      count: a.count,
    }));

    const cityRanking = cityAgg.map((c) => ({
      city: c._id ?? "Unknown",
      count: c.count,
    }));

    res.status(200).json({
      success: true,
      stats: {

        // ===== Network Statistics =====
        totalDonors,
        registeredCityDonors,

        availableDonors,
        availableCityDonors,

        openRequests,
        completedDonations,

        // ===== User Details =====
        userName: user.name,
        bloodGroup: user.bloodGroup,
        city: user.city,
        weight: user.weight ?? null,
        availabilityStatus: user.availabilityStatus,
        lastDonationDate: user.lastDonationDate,

        // ===== Personal Statistics =====
        myDonations,
        myRequests,
        requestsFulfilled,
        livesImpacted,
        eligibleAgainDate,
        isEligibleNow,

        // ===== Charts =====
        bloodGroupDistribution,
        availabilityDistribution,
        cityRanking,

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