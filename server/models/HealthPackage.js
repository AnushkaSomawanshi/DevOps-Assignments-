import mongoose from "mongoose";

const healthPackageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    tests: [{ type: String, required: true }],
    testCount: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, required: true },
    popular: { type: Boolean, required: true },
    gender: { type: String, enum: ["female", "male", "both"], required: true },
    ageGroup: String,
  },
  { versionKey: false }
);

export const HealthPackage = mongoose.model("HealthPackage", healthPackageSchema);
