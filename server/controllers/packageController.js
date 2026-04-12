import { HealthPackage } from "../models/HealthPackage.js";

export async function listPackages(_req, res) {
  const packages = await HealthPackage.find().sort({ popular: -1, price: 1 }).lean();
  res.json(packages);
}
