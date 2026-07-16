import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import generateBloodBridgeId from "../utils/generateBloodBridgeId";
import generateToken from "../utils/generateToken";
import { AuthRequest } from "../middleware/authMiddleware";

// ==========================
// Register User
// ==========================
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const bloodBridgeId = await generateBloodBridgeId();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      bloodBridgeId,
      name,
      email,
      password: hashedPassword,
    });

    const userResponse = user.toObject();
    delete (userResponse as any).password;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
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
      _id: { $ne: req.userId },
      role: "user",
      availabilityStatus: "Available",
      $or: [
        { nextEligibleDonationDate: { $exists: false } },
        { nextEligibleDonationDate: null },
        { nextEligibleDonationDate: { $lte: new Date() } },
      ],
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