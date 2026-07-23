import mongoose, { Schema, Document } from "mongoose";

export interface IPasswordReset extends Document {
  email: string;
  otp: string;
  otpExpires: Date;
}

const passwordResetSchema = new Schema<IPasswordReset>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
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

export default mongoose.model<IPasswordReset>(
  "PasswordReset",
  passwordResetSchema
);