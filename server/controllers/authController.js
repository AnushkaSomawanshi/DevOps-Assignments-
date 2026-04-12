import { Doctor } from "../models/Doctor.js";
import { Hospital } from "../models/Hospital.js";
import { User } from "../models/User.js";

function sanitizeUser(user) {
  const { password, _id, ...safeUser } = user;
  return safeUser;
}

export async function login(req, res) {
  const { email, role, password } = req.body ?? {};
  if (!email || !role) {
    return res.status(400).json({ message: "Email and role are required" });
  }

  const user = await User.findOne({ email: String(email).toLowerCase(), role }).lean();
  if (!user) return res.status(404).json({ message: "No matching account found" });

  if (password && user.password !== password) {
    return res.status(401).json({ message: "Invalid password" });
  }

  res.json(sanitizeUser(user));
}

export async function register(req, res) {
  const {
    name,
    email,
    phone,
    role,
    password,
    abhaId,
    speciality,
    qualifications,
  } = req.body ?? {};

  if (!name || !email || !phone || !role || !password) {
    return res.status(400).json({ message: "Missing required registration fields" });
  }

  const existing = await User.findOne({ email: String(email).toLowerCase() }).lean();
  if (existing) return res.status(409).json({ message: "Email already registered" });

  const id = `user-${Date.now()}`;
  const user = await User.create({
    id,
    name,
    email: String(email).toLowerCase(),
    phone,
    role,
    password,
    abhaId: abhaId || undefined,
    createdAt: new Date().toISOString(),
    active: true,
    speciality: speciality || undefined,
    qualifications: qualifications || undefined,
  });

  if (role === "doctor") {
    const defaultHospital = await Hospital.findOne().lean();
    if (defaultHospital) {
      await Doctor.create({
        id: `d-${Date.now()}`,
        name,
        speciality: speciality || "General Practice",
        qualification: qualifications || "MBBS",
        experience: 0,
        rating: 4.5,
        reviewCount: 0,
        hospitalId: defaultHospital.id,
        hospitalName: defaultHospital.name,
        location: defaultHospital.city,
        imageUrl: "/assets/generated/hero-gynecology.dim_1400x600.jpg",
        bio: "New specialist profile pending detailed onboarding.",
        consultationFee: 800,
        availableDays: ["Monday", "Wednesday", "Friday"],
        languages: ["English", "Hindi"],
        expertise: [speciality || "General Practice"],
      });
    }
  }

  res.status(201).json(sanitizeUser(user.toObject()));
}
