import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  bloodBridgeId: string;
  name: string;
  email: string;
  password: string;

  phone?: string;
  profilePhoto?: string;

  bloodGroup?: string;
  dateOfBirth?: Date;
  gender?: string;
  weight?: number;
  city?: string;

  location?: {
    type: string;
    coordinates: number[];
  };

  availabilityStatus: "Available" | "Busy" | "Unavailable";

  lastDonationDate?: Date;
  nextEligibleDonationDate?: Date;

  totalDonations: number;

  role: "user" | "admin";
}

const userSchema = new Schema<IUser>(
  {
    bloodBridgeId: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: String,

    profilePhoto: String,

    bloodGroup: String,

    dateOfBirth: Date,

    gender: String,

    weight: Number,

    city: String,

    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },

    availabilityStatus: {
      type: String,
      enum: ["Available", "Busy", "Unavailable"],
      default: "Available",
    },

    lastDonationDate: Date,

    nextEligibleDonationDate: Date,

    totalDonations: {
      type: Number,
      default: 0,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ location: "2dsphere" });

const User = mongoose.model<IUser>("User", userSchema);

export default User;