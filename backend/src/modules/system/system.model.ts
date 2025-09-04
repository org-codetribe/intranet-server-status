import { Schema, model, Document } from "mongoose";

export interface ISystemStatus extends Document {
  service: "Backend" | "MongoDB" | "Frontend";
  status: "UP" | "DOWN";
  message?: string;
  checkedAt: Date;
  targetUrl: string;
}

const systemStatusSchema = new Schema<ISystemStatus>(
  {
    service: {
      type: String,
      enum: ["Backend", "MongoDB", "Frontend"],
      required: true,
    },
    status: {
      type: String,
      enum: ["UP", "DOWN"],
      required: true,
    },
    message: {
      type: String,
    },
    checkedAt: {
      type: Date,
      default: Date.now,
    },
    targetUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

export const SystemStatus = model<ISystemStatus>(
  "SystemStatus",
  systemStatusSchema
);
