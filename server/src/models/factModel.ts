import mongoose, { Schema, Document } from "mongoose";

export interface IFact extends Document {
  text: string;
  active: boolean;
}

const factSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IFact>("Fact", factSchema);