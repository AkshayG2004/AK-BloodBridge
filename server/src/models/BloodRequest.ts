import mongoose, { Document, Schema } from "mongoose";

export interface IBloodRequest extends Document {
  requester: mongoose.Types.ObjectId;

  acceptedDonors: {
    donor: mongoose.Types.ObjectId;

    status:
      | "Accepted"
      | "Completed"
      | "Rejected";

    confirmedAt?: Date;
  }[];

  patientName: string;
  bloodGroup: string;
  unitsRequired: number;

  hospitalName: string;
  hospitalCity: string;
  hospitalAddress: string;

  contactPerson: string;
  contactNumber: string;

  urgency: "Low" | "Medium" | "High" | "Critical";

  requiredBefore: Date;

  notes?: string;

  status: "Open" | "Completed" | "Cancelled";
}

const bloodRequestSchema = new Schema<IBloodRequest>(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

acceptedDonors: [
  new Schema(
    {
      donor: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      status: {
        type: String,
        enum: [
          "Accepted",
          "Completed",
          "Rejected",
        ],
        default: "Accepted",
      },

      confirmedAt: {
        type: Date,
      },
    },
    { _id: false }
  ),
],

    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    bloodGroup: {
      type: String,
      enum: [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ],
      required: true,
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

    contactPerson: {
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

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "Open",
        "Completed",
        "Cancelled",
      ],
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