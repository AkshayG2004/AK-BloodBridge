import mongoose, { Schema, Document } from "mongoose";

export interface IPendingRegistration extends Document {
  name: string;
  email: string;
  password: string;
  otp: string;
  expiresAt: Date;
}

const pendingRegistrationSchema = new Schema<IPendingRegistration>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    otp: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically delete expired registrations
pendingRegistrationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export default mongoose.model<IPendingRegistration>(
  "PendingRegistration",
  pendingRegistrationSchema
);