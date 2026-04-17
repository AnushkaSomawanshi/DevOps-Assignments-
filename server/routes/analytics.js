import express from "express";

const router = express.Router();

// Mock Analytics Data for demonstration (Plug-and-play)

router.get("/patients", (req, res) => {
  // Returns daily patient count for the last 7 days
  const data = [
    { name: "Mon", patients: 45 },
    { name: "Tue", patients: 52 },
    { name: "Wed", patients: 38 },
    { name: "Thu", patients: 65 },
    { name: "Fri", patients: 48 },
    { name: "Sat", patients: 70 },
    { name: "Sun", patients: 30 },
  ];
  return res.json(data);
});

router.get("/revenue", (req, res) => {
  // Returns revenue per month
  const data = [
    { name: "Jan", revenue: 4000 },
    { name: "Feb", revenue: 3000 },
    { name: "Mar", revenue: 2000 },
    { name: "Apr", revenue: 2780 },
    { name: "May", revenue: 1890 },
    { name: "Jun", revenue: 2390 },
    { name: "Jul", revenue: 3490 },
  ];
  return res.json(data);
});

router.get("/doctors", (req, res) => {
  // Returns doctor workload / performance (appointments handled)
  const data = [
    { name: "Dr. Smith", appointments: 120 },
    { name: "Dr. Jones", appointments: 90 },
    { name: "Dr. Taylor", appointments: 150 },
    { name: "Dr. Brown", appointments: 80 },
  ];
  return res.json(data);
});

export default router;
