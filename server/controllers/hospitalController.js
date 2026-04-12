import { Hospital } from "../models/Hospital.js";

export async function listHospitals(_req, res) {
  const hospitals = await Hospital.find().sort({ city: 1, name: 1 }).lean();
  res.json(hospitals);
}

export async function getHospitalById(req, res) {
  const hospital = await Hospital.findOne({ id: req.params.id }).lean();
  if (!hospital) return res.status(404).json({ message: "Hospital not found" });
  res.json(hospital);
}
