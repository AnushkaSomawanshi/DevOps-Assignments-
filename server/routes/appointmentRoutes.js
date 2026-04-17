import { Router } from "express";
import {
  cancelAppointment,
  createAppointment,
  getAppointmentById,
  getAvailableSlots,
  listAppointments,
  listDoctorAppointments,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";

const router = Router();

router.get("/", listAppointments);
router.get("/doctor/:doctorId", listDoctorAppointments);
router.get("/slots/available", getAvailableSlots);
router.get("/:id", getAppointmentById);
router.post("/", createAppointment);
router.patch("/:id/cancel", cancelAppointment);
router.patch("/:id/status", updateAppointmentStatus);

export default router;
