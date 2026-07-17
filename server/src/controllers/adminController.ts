import { Response } from "express";
import User from "../models/User";
import BloodRequest from "../models/BloodRequest";
import { AuthRequest } from "../middleware/authMiddleware";

// ==========================
// Get All Users
// ==========================
export const getAllUsers = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });

  } catch (error) {
    console.error("========== GET ALL USERS ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Delete User
// ==========================
export const deleteUser = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    // Prevent admin deleting himself
    if (id === req.userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    // Don't delete users with completed donation history
    if (user.totalDonations > 0) {
    return res.status(400).json({
        success: false,
        message: "Cannot delete a donor with completed donation history",
    });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    console.error("========== DELETE USER ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Get All Blood Requests
// ==========================
export const getAllRequests = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const requests = await BloodRequest.find()
      .populate("requester", "bloodBridgeId name phone city")
      .populate("acceptedBy", "bloodBridgeId name phone city")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });

  } catch (error) {
    console.error("========== GET ALL REQUESTS ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Delete Blood Request
// ==========================
export const deleteRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const request = await BloodRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found",
      });
    }

    await request.deleteOne();

    res.status(200).json({
      success: true,
      message: "Blood request deleted successfully",
    });

  } catch (error) {
    console.error("========== DELETE REQUEST ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Admin Dashboard Stats
// ==========================
export const getDashboardStats = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const totalUsers = await User.countDocuments({
      role: "user",
    });

    const totalRequests = await BloodRequest.countDocuments();

    const openRequests = await BloodRequest.countDocuments({
      status: "Open",
    });

    const acceptedRequests = await BloodRequest.countDocuments({
      status: "Accepted",
    });

    const completedRequests = await BloodRequest.countDocuments({
      status: "Completed",
    });

    const cancelledRequests = await BloodRequest.countDocuments({
      status: "Cancelled",
    });

    const availableDonors = await User.countDocuments({
      role: "user",
      availabilityStatus: "Available",
    });

    const criticalRequests = await BloodRequest.countDocuments({
      urgency: "Critical",
      status: "Open",
    });

    

    const donations = await User.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$totalDonations",
          },
        },
      },
    ]);

    // Blood group distribution
    const bloodGroupStats = await User.aggregate([
      {
        $match: {
          role: "user",
          bloodGroup: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$bloodGroup",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // City distribution
    const cityStats = await User.aggregate([
      {
        $match: {
          role: "user",
          city: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$city",
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    // Critical Requests List
    const criticalRequestList = await BloodRequest.find({
      urgency: "Critical",
      status: "Open",
    })
      .select(
        "patientName bloodGroup hospitalCity requiredBefore"
      )
      .sort({
        requiredBefore: 1,
      })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalRequests,

        openRequests,
        acceptedRequests,
        completedRequests,
        cancelledRequests,

        totalDonations: donations[0]?.total || 0,

        availableDonors,
        criticalRequests,

        bloodGroupStats,
        cityStats,
        criticalRequestList,
      },
    });
  } catch (error) {
    console.error("========== ADMIN DASHBOARD ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateRequestStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "Open",
      "Accepted",
      "Completed",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request status",
      });
    }

    const request = await BloodRequest.findByIdAndUpdate(
      id,
      { status },
      {
        returnDocument: "after",
      }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Request status updated successfully",
      request,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};