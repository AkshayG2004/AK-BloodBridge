import mongoose, { Document, Schema } from "mongoose";

export interface IPendingUser extends Document {
  name: string;
  email: string;
  password: string;

  otp: string;
  otpExpires: Date;
}

const pendingUserSchema = new Schema<IPendingUser>(
  {
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

    otp: {
      type: String,
      required: true,
    },

    otpExpires: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Delete pending users after 1 hour
pendingUserSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 3600 }
);

const PendingUser = mongoose.model<IPendingUser>(
  "PendingUser",
  pendingUserSchema
);

export default PendingUser;