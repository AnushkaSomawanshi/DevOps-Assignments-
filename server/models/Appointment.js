import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    patientId: { type: String, required: true },
    patientName: { type: String, required: true },
    doctorId: { type: String, required: true },
    doctorName: { type: String, required: true },
    hospitalId: { type: String, required: true },
    hospitalName: { type: String, required: true },
    department: { type: String, required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    time: { type: String },
    type: { type: String, enum: ["in-person", "teleconsultation"], required: true },
    status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], required: true },
    reason: String,
    notes: String,
    prescription: String,
    paymentStatus: { type: String, enum: ["pending", "paid"], required: true },
    amount: { type: Number, required: true, min: 0 },
    createdAt: { type: String, required: true },
  },
  { versionKey: false }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
