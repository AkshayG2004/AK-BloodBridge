import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import PendingUser from "../models/PendingUser";
import PasswordReset from "../models/PasswordReset";
import { sendOTPEmail } from "../services/emailService";

import generateBloodBridgeId from "../utils/generateBloodBridgeId";
import generateToken from "../utils/generateToken";
import { AuthRequest } from "../middleware/authMiddleware";

export const sendRegistrationOTP = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Already registered?
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Generate OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save / Update pending user
    await PendingUser.findOneAndUpdate(
      { email },
      {
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpires: new Date(Date.now() + 5 * 60 * 1000),
      },
      {
        upsert: true,
        new: true,
      }
    );

    // Send Email
    await sendOTPEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("========== SEND OTP ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Forgot Password - Send OTP
// ==========================
export const forgotPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check whether user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    // Generate OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Save / Update Password Reset OTP
    await PasswordReset.findOneAndUpdate(
      { email },
      {
        email,
        otp,
        otpExpires: new Date(Date.now() + 5 * 60 * 1000),
      },
      {
        upsert: true,
        new: true,
      }
    );

    // Send OTP Email
    await sendOTPEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "Password reset OTP sent successfully",
    });

  } catch (error) {

    console.error("========== FORGOT PASSWORD ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

export const resetPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const resetRequest = await PasswordReset.findOne({ email });

    if (!resetRequest) {
      return res.status(400).json({
        success: false,
        message: "Password reset request not found",
      });
    }

    if (resetRequest.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (resetRequest.otpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
      }
    );

    await PasswordReset.deleteOne({ email });

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Register User
// ==========================
export const registerUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, otp } = req.body;

    const pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser) {
      return res.status(400).json({
        success: false,
        message: "Registration request not found",
      });
    }

    if (pendingUser.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (pendingUser.otpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    const existingUser = await User.findOne({
      email: pendingUser.email,
    });

    if (existingUser) {
      await PendingUser.deleteOne({
        email: pendingUser.email,
      });

      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const bloodBridgeId = await generateBloodBridgeId();

    const user = await User.create({
      bloodBridgeId,
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
    });

    await PendingUser.deleteOne({
      email: pendingUser.email,
    });

    const userResponse = user.toObject();
    delete (userResponse as any).password;

    res.status(201).json({
      success: true,
      message: "Registration completed successfully",
      user: userResponse,
    });

  } catch (error) {
    console.error("========== REGISTER ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Login User
// ==========================
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id.toString());

    const userResponse = user.toObject();
    delete (userResponse as any).password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("========== LOGIN ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Get My Profile
// ==========================
export const getMyProfile = async (
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

// ==========================
// Update Profile
// ==========================
export const updateProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      phone,
      bloodGroup,
      dateOfBirth,
      gender,
      weight,
      city,
      availabilityStatus,
    } = req.body;

    if (phone !== undefined) user.phone = phone;
    if (bloodGroup !== undefined) user.bloodGroup = bloodGroup;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (gender !== undefined) user.gender = gender;
    if (weight !== undefined) user.weight = weight;
    if (city !== undefined) user.city = city;
    if (availabilityStatus !== undefined)
      user.availabilityStatus = availabilityStatus;

    // Update profile completion status
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

// ==========================
// Update Location
// ==========================
export const updateLocation = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { latitude, longitude } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Location updated successfully",
      location: user.location,
    });
  } catch (error) {
    console.error("========== UPDATE LOCATION ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Update Availability
// ==========================
export const updateAvailability = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { availabilityStatus } = req.body;

    if (
      !["Available", "Busy", "Unavailable"].includes(availabilityStatus)
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

    user.availabilityStatus = availabilityStatus;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      availabilityStatus: user.availabilityStatus,
    });
  } catch (error) {
    console.error("========== UPDATE AVAILABILITY ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Get Donors
// ==========================
export const getDonors = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const bloodGroup = req.query.bloodGroup?.toString();

    const query: any = {
      _id: { $ne: req.userId },      // Don't show yourself
      role: "user",                  // Hide admins
      isProfileComplete: true,       // Only completed profiles
      availabilityStatus: "Available", // Only available donors
    };

    if (bloodGroup) {
      query.bloodGroup = bloodGroup;
    }

    console.log("Logged In User:", req.userId);
    console.log("Blood Group:", bloodGroup);
    console.log("Mongo Query:", query);

    const donors = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    console.log("Found Donors:", donors.length);

    res.status(200).json({
      success: true,
      count: donors.length,
      donors,
    });
  } catch (error) {
    console.error("========== GET DONORS ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Find Nearby Donors
// ==========================
export const getNearbyDonors = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const distance = Number(req.query.distance) || 10;

    const loggedInUser = await User.findById(req.userId);

    if (!loggedInUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!loggedInUser.location) {
      return res.status(400).json({
        success: false,
        message: "Please update your location first",
      });
    }

    const donors = await User.find({
      _id: { $ne: req.userId },
      availabilityStatus: "Available",
      location: {
        $near: {
          $geometry: loggedInUser.location,
          $maxDistance: distance * 1000, // km → meters
        },
      },
    }).select("-password");

    res.status(200).json({
      success: true,
      distance: `${distance} km`,
      count: donors.length,
      donors,
    });

  } catch (error) {
    console.error("========== NEARBY DONORS ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};