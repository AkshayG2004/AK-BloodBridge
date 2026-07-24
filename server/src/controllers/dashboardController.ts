import { Response } from "express";
import User, { IUser } from "../models/User";
import BloodRequest from "../models/BloodRequest";
import { AuthRequest } from "../middleware/authMiddleware";

const MS_IN_DAY = 1000 * 60 * 60 * 24;
const ELIGIBILITY_GAP_DAYS = 90;

// Excludes admins from every "user/donor" stat shown on the dashboard.
const NON_ADMIN_FILTER = { role: { $ne: "admin" as const } };

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

      User.countDocuments(NON_ADMIN_FILTER),

      User.countDocuments({
        ...NON_ADMIN_FILTER,
        availabilityStatus: "Available",
      }),

      User.countDocuments({
        ...NON_ADMIN_FILTER,
        city: user.city,
      }),

      User.countDocuments({
        ...NON_ADMIN_FILTER,
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

      BloodRequest.countDocuments({
        donor: req.userId,
        status: "Completed",
      }),

      User.aggregate([
        { $match: NON_ADMIN_FILTER },
        { $group: { _id: "$bloodGroup", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      User.aggregate([
        { $match: NON_ADMIN_FILTER },
        { $group: { _id: "$availabilityStatus", count: { $sum: 1 } } },
      ]),

      User.aggregate([
        { $match: NON_ADMIN_FILTER },
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
        totalDonors,
        registeredCityDonors,
        availableDonors,
        availableCityDonors,
        openRequests,
        completedDonations,
        userName: user.name,
        bloodGroup: user.bloodGroup,
        city: user.city,
        weight: user.weight ?? null,
        availabilityStatus: user.availabilityStatus,
        lastDonationDate: user.lastDonationDate,
        myDonations,
        myRequests,
        requestsFulfilled,
        livesImpacted,
        eligibleAgainDate,
        isEligibleNow,
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