import { Response } from "express";
import BloodRequest from "../models/BloodRequest";
import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

// ==========================
// Create Blood Request
// ==========================
export const createBloodRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
        patientName,
        bloodGroup,
        unitsRequired,
        hospitalName,
        hospitalCity,
        hospitalAddress,
        contactPerson,
        contactNumber,
        urgency,
        requiredBefore,
        notes,
    } = req.body;

    const bloodRequest = await BloodRequest.create({
      requester: req.userId,
      patientName,
      bloodGroup,
      unitsRequired,
      hospitalName,
      hospitalCity,
      hospitalAddress,
      contactPerson,
      contactNumber,
      urgency,
      requiredBefore,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Blood request created successfully",
      request: bloodRequest,
    });

  } catch (error) {
    console.error("========== CREATE BLOOD REQUEST ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Get Open Blood Requests
// ==========================
export const getBloodRequests = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const requests = await BloodRequest.find({
      status: "Open",
      requiredBefore: { $gte: new Date() },
    })
      .populate("requester", "bloodBridgeId name phone city")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });

  } catch (error) {
    console.error("========== GET BLOOD REQUESTS ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Accept Blood Request
// ==========================
export const acceptBloodRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const request = await BloodRequest.findById(id);
    
    const donor = await User.findById(req.userId);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (donor.availabilityStatus !== "Available") {
      return res.status(400).json({
        success: false,
        message: `You are currently ${donor.availabilityStatus.toLowerCase()} and cannot accept blood requests.`,
      });
    }

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found",
      });
    }

    // Already accepted?
    if (request.status !== "Open") {
      return res.status(400).json({
        success: false,
        message: "This request has already been processed",
      });
    }

    // Prevent requester from accepting own request
    if (request.requester.toString() === req.userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot accept your own blood request",
      });
    }

    if (
      donor.nextEligibleDonationDate &&
      donor.nextEligibleDonationDate > new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: `You are eligible to donate again on ${donor.nextEligibleDonationDate.toDateString()}`,
      });
    }

    request.status = "Accepted";
    request.acceptedBy = req.userId as any;

    await request.save();

    const updatedRequest = await BloodRequest.findById(id)
      .populate("requester", "bloodBridgeId name phone city")
      .populate("acceptedBy", "bloodBridgeId name phone city");

    res.status(200).json({
      success: true,
      message: "Blood request accepted successfully",
      request: updatedRequest,
    });

  } catch (error) {
    console.error("========== ACCEPT REQUEST ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Complete Blood Donation
// ==========================
export const completeBloodDonation = async (
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

    if (request.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message: "Only accepted requests can be completed",
      });
    }

    // Only donor who accepted the request can complete it
    if (request.acceptedBy?.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to complete this donation",
      });
    }

    // Update request status
    request.status = "Completed";
    await request.save();

    // Update donor statistics
    const donor = await User.findById(req.userId);

    if (donor) {
      donor.totalDonations += 1;

      const today = new Date();

      donor.lastDonationDate = today;

      // 90-days eligibility gap
      const nextEligible = new Date(today);
      nextEligible.setDate(nextEligible.getDate() + 90);

      donor.nextEligibleDonationDate = nextEligible;

      // Automatically make donor unavailable
      donor.availabilityStatus = "Unavailable";

      await donor.save();
    }

    // Fetch updated request
    const updatedRequest = await BloodRequest.findById(id)
      .populate("requester", "bloodBridgeId name")
      .populate("acceptedBy", "bloodBridgeId name");

    // Fetch updated donor without password
    const updatedDonor = await User.findById(req.userId).select("-password");

    res.status(200).json({
      success: true,
      message: "Donation completed successfully",
      request: updatedRequest,
      donor: updatedDonor,
    });

  } catch (error) {
    console.error("========== COMPLETE DONATION ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getMyBloodRequests = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const requests = await BloodRequest.find({
      requester: req.userId,
    })
      .populate("acceptedBy", "bloodBridgeId name phone city")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });

  } catch (error) {
    console.error("========== GET MY REQUESTS ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getAcceptedRequests = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const requests = await BloodRequest.find({
      acceptedBy: req.userId,
    })
      .populate("requester", "bloodBridgeId name phone city")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });

  } catch (error) {
    console.error("========== GET ACCEPTED REQUESTS ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};