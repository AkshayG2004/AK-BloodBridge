import mongoose, { Document, Schema } from "mongoose";

export interface IBloodRequest extends Document {
  requester: mongoose.Types.ObjectId;
  acceptedBy?: mongoose.Types.ObjectId;

  patientName: string;
  bloodGroup: string;
  unitsRequired: number;

  hospitalName: string;
  hospitalCity: string;
  hospitalAddress: string;

  contactNumber: string;

  urgency: "Low" | "Medium" | "High" | "Critical";

  requiredBefore: Date;

  status: "Open" | "Accepted" | "Completed" | "Cancelled";
}

const bloodRequestSchema = new Schema<IBloodRequest>(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    acceptedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    bloodGroup: {
      type: String,
      required: true,
      trim: true,
    },

    unitsRequired: {
      type: Number,
      required: true,
      min: 1,
    },

    hospitalName: {
      type: String,
      required: true,
      trim: true,
    },

    hospitalCity: {
      type: String,
      required: true,
      trim: true,
    },

    hospitalAddress: {
      type: String,
      required: true,
      trim: true,
    },

    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },

    urgency: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    requiredBefore: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Open", "Accepted", "Completed", "Cancelled"],
      default: "Open",
    },
  },
  {
    timestamps: true,
  }
);

const BloodRequest = mongoose.model<IBloodRequest>(
  "BloodRequest",
  bloodRequestSchema
);

export default BloodRequest;