import { User } from "../models/User.js";

function toClientUser(user) {
  const { password, _id, ...safeUser } = user;
  return safeUser;
}

export async function listUsers(req, res) {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  const users = await User.find(filter).sort({ createdAt: -1 }).lean();
  res.json(users.map(toClientUser));
}

export async function getUserById(req, res) {
  const user = await User.findOne({ id: req.params.id }).lean();
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(toClientUser(user));
}
