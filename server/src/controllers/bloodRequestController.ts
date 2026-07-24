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

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 25);

    const filter: any = {
      status: "Open",
      requiredBefore: { $gte: new Date() },
      requester: { $ne: req.userId },
      $expr: {
        $lt: [
          { $size: "$acceptedDonors" },
          "$unitsRequired",
        ],
      },
    };

    const [requests, total] = await Promise.all([

      BloodRequest.find(filter)
        .populate("requester", "bloodBridgeId name phone city")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),

      BloodRequest.countDocuments(filter),

    ]);

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
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

    // Donor already accepted this request?
    if (
      request.acceptedDonors.some(
        (d) => d.donor.toString() === req.userId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "You have already accepted this request.",
      });
    }

    request.acceptedDonors.push({
      donor: req.userId as any,
      status: "Accepted",
    });

    await request.save();

    const updatedRequest = await BloodRequest.findById(id)
    .populate("requester", "bloodBridgeId name phone city")
    .populate(
      "acceptedDonors.donor",
      "bloodBridgeId name phone city"
    );

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

export const getMyBloodRequests = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 25);

    const filter: any = { requester: req.userId };

    const [requests, total] = await Promise.all([

      BloodRequest.find(filter)
        .populate(
          "acceptedDonors.donor",
          "bloodBridgeId name phone city"
        )
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),

      BloodRequest.countDocuments(filter),

    ]);

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
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

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 25);

    const filter: any = { "acceptedDonors.donor": req.userId };

    const [requests, total] = await Promise.all([

      BloodRequest.find(filter)
        .populate("requester", "bloodBridgeId name phone city")
        .populate(
          "acceptedDonors.donor",
          "bloodBridgeId name phone city"
        )
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),

      BloodRequest.countDocuments(filter),

    ]);

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
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

// ==========================
// Confirm Individual Donor
// ==========================
export const confirmDonation = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { requestId, donorId } = req.params;

    const request = await BloodRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Only requester can confirm
    if (request.requester.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const donorEntry = request.acceptedDonors.find(
      (d) => d.donor.toString() === donorId
    );

    if (!donorEntry) {
      return res.status(404).json({
        success: false,
        message: "Donor not found in this request",
      });
    }

    // already processed
    if (donorEntry.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message: "Already confirmed",
      });
    }

    donorEntry.status = "Completed";
    donorEntry.confirmedAt = new Date();

    // if completed update donor profile
    {
      const donor = await User.findById(donorId);

      if (donor) {
        donor.totalDonations += 1;

        donor.lastDonationDate = new Date();

        const nextDate = new Date();
        nextDate.setMonth(nextDate.getMonth() + 3);

        donor.nextEligibleDonationDate = nextDate;
        donor.availabilityStatus = "Unavailable";

        await donor.save();
      }
    }

    // if every accepted donor has been processed
    const completedCount = request.acceptedDonors.filter(
      (d) => d.status === "Completed"
    ).length;

    if (completedCount >= request.unitsRequired) {
      request.status = "Completed";
    } else {
      request.status = "Open";
    }

    await request.save();

    res.json({
      success: true,
      message: "Donation status updated",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Reject Individual Donor
// ==========================
export const rejectDonation = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { requestId, donorId } = req.params;

    const request = await BloodRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Only requester can reject
    if (request.requester.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const donorEntry = request.acceptedDonors.find(
      (d) => d.donor.toString() === donorId
    );

    if (!donorEntry) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    if (donorEntry.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message: "Donation already processed",
      });
    }

    donorEntry.status = "Rejected";
    donorEntry.confirmedAt = new Date();

    // If every donor has been processed, close the request
    const completedCount = request.acceptedDonors.filter(
      (d) => d.status === "Completed"
    ).length;

    if (completedCount >= request.unitsRequired) {
      request.status = "Completed";
    } else {
      request.status = "Open";
    }

    await request.save();

    res.status(200).json({
      success: true,
      message: "Donation rejected successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};