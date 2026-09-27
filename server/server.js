import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDatabase } from "./config/db.js";
import { seedDatabase } from "./utils/seed.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatbotRoutes from "./routes/chatbot.js";
import analyticsRoutes from "./routes/analytics.js";
import reportsRoutes from "./routes/reports.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hospitalDB";

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "GyneCare Hospital Management System API is running inside Docker.",
    status: "healthy",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      doctors: "/api/doctors",
      hospitals: "/api/hospitals",
      packages: "/api/packages",
      blogs: "/api/blogs"
    }
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    status: "healthy",
    service: "GyneCare Hospital Management API",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reports", reportsRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

async function initDatabase(uri) {
  try {
    await connectDatabase(uri);
    await seedDatabase();
    console.log("Connected to MongoDB and seeded initial records successfully.");
  } catch (error) {
    console.warn(`[Database Notice] MongoDB at ${uri} is not yet available: ${error.message}`);
    console.log("Retrying database connection in 5 seconds...");
    setTimeout(() => initDatabase(uri), 5000);
  }
}

async function start() {
  initDatabase(MONGO_URI);
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GyneCare API server listening on http://0.0.0.0:${PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
