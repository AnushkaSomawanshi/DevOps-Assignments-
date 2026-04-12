import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    imageUrl: { type: String, required: true },
    facilities: [{ type: String, required: true }],
    bedCapacity: { type: Number, required: true, min: 0 },
    doctorCount: { type: Number, required: true, min: 0 },
    emergencyAvailable: { type: Boolean, required: true },
    emergencyContact: { type: String, default: "" },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  { versionKey: false }
);

export const Hospital = mongoose.model("Hospital", hospitalSchema);
