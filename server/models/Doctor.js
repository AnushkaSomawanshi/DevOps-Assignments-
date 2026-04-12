import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    speciality: { type: String, required: true },
    qualification: { type: String, required: true },
    experience: { type: Number, required: true, min: 0 },
    rating: { type: Number, required: true, min: 0, max: 5 },
    reviewCount: { type: Number, required: true, min: 0 },
    hospitalId: { type: String, required: true },
    hospitalName: { type: String, required: true },
    location: { type: String, required: true },
    imageUrl: { type: String, required: true },
    bio: { type: String, required: true },
    consultationFee: { type: Number, required: true, min: 0 },
    availableDays: [{ type: String, required: true }],
    languages: [{ type: String, required: true }],
    expertise: [{ type: String, required: true }],
  },
  { versionKey: false }
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
