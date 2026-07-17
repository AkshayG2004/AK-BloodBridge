import { Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

// =========================
// Get Logged In User Profile
// =========================

export const getProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Automatically restore availability after eligibility date
    if (
      user.availabilityStatus === "Unavailable" &&
      user.nextEligibleDonationDate &&
      user.nextEligibleDonationDate <= new Date()
    ) {
      user.availabilityStatus = "Available";
      await user.save();
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("========== GET PROFILE ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =========================
// Update Logged In User Profile
// =========================

export const updateProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      bloodGroup,
      phone,
      gender,
      dateOfBirth,
      weight,
      city,
      availabilityStatus,
    } = req.body;

    const validAvailability = [
      "Available",
      "Busy",
    ];

    if (
      availabilityStatus &&
      !validAvailability.includes(availabilityStatus)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid availability status",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update only supplied fields

    if (bloodGroup !== undefined) {
      user.bloodGroup = bloodGroup;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (gender !== undefined) {
      user.gender = gender;
    }

    if (dateOfBirth !== undefined) {
      user.dateOfBirth = dateOfBirth;
    }

    if (weight !== undefined) {
      user.weight = weight;
    }

    if (city !== undefined) {
      user.city = city;
    }

    // User can only manually switch between Available and Busy.
    // "Unavailable" is controlled automatically by the donation system.
    if (availabilityStatus !== undefined) {
    if (
      user.availabilityStatus !== "Unavailable" &&
      (availabilityStatus === "Available" ||
        availabilityStatus === "Busy")
    ) {
      user.availabilityStatus = availabilityStatus;
    }
  }

    // Check whether profile is complete
    user.isProfileComplete =
      !!user.bloodGroup &&
      !!user.phone &&
      !!user.gender &&
      !!user.dateOfBirth &&
      !!user.weight &&
      !!user.city;

    await user.save();

    const updatedUser = await User.findById(req.userId).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("========== UPDATE PROFILE ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};