import { Doctor } from "../models/Doctor.js";

export async function listDoctors(req, res) {
  const { location, speciality } = req.query;
  const filter = {};

  if (location) filter.location = new RegExp(String(location), "i");
  if (speciality) filter.speciality = new RegExp(String(speciality), "i");

  const doctors = await Doctor.find(filter).sort({ rating: -1, name: 1 }).lean();
  res.json(doctors);
}

export async function getDoctorById(req, res) {
  const doctor = await Doctor.findOne({ id: req.params.id }).lean();
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });
  res.json(doctor);
}
