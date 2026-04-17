import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    role: { type: String, enum: ["patient", "doctor", "admin"], required: true },
    avatar: String,
    abhaId: String,
    createdAt: { type: String, required: true },
    password: { type: String, required: true },
    active: { type: Boolean, default: true },
    speciality: String,
    qualifications: String,
    doctorId: String,
  },
  { versionKey: false }
);

export const User = mongoose.model("User", userSchema);
