import { Appointment } from "../models/Appointment.js";
import { Doctor } from "../models/Doctor.js";
import { Hospital } from "../models/Hospital.js";

const DEFAULT_TIMES = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

export async function listAppointments(req, res) {
  const filter = {};
  if (req.query.patientId) filter.patientId = req.query.patientId;
  if (req.query.doctorId) filter.doctorId = req.query.doctorId;
  if (req.query.status) filter.status = req.query.status;

  const appointments = await Appointment.find(filter).sort({ date: 1, timeSlot: 1 }).lean();
  res.json(appointments);
}

export async function getAppointmentById(req, res) {
  const appointment = await Appointment.findOne({ id: req.params.id }).lean();
  if (!appointment) return res.status(404).json({ message: "Appointment not found" });
  res.json(appointment);
}

export async function createAppointment(req, res) {
  const payload = req.body ?? {};
  const doctor = await Doctor.findOne({ id: payload.doctorId }).lean();
  const hospital = await Hospital.findOne({ id: payload.hospitalId }).lean();

  if (!doctor || !hospital) {
    return res.status(400).json({ message: "Invalid doctor or hospital selection" });
  }

  const appointment = await Appointment.create({
    ...payload,
    id: `apt${Date.now()}`,
    doctorName: payload.doctorName || doctor.name,
    hospitalName: payload.hospitalName || hospital.name,
    amount: payload.amount ?? doctor.consultationFee,
    status: payload.status ?? "pending",
    paymentStatus: payload.paymentStatus ?? "pending",
    createdAt: payload.createdAt ?? new Date().toISOString(),
  });

  res.status(201).json(appointment.toObject());
}

export async function cancelAppointment(req, res) {
  const appointment = await Appointment.findOneAndUpdate(
    { id: req.params.id },
    { status: "cancelled" },
    { new: true }
  ).lean();

  if (!appointment) return res.status(404).json({ message: "Appointment not found" });
  res.json(appointment);
}

export async function updateAppointmentStatus(req, res) {
  const { status } = req.body ?? {};
  if (!status) return res.status(400).json({ message: "Status is required" });

  const appointment = await Appointment.findOneAndUpdate(
    { id: req.params.id },
    { status },
    { new: true }
  ).lean();

  if (!appointment) return res.status(404).json({ message: "Appointment not found" });
  res.json(appointment);
}

export async function getAvailableSlots(req, res) {
  const { doctorId, date } = req.query;
  if (!doctorId || !date) {
    return res.status(400).json({ message: "doctorId and date are required" });
  }

  const appointments = await Appointment.find({
    doctorId,
    date,
    status: { $ne: "cancelled" },
  }).lean();

  const booked = new Set(appointments.map((appointment) => appointment.timeSlot));
  const slots = DEFAULT_TIMES.map((time, index) => ({
    id: `slot-${index}`,
    time,
    available: !booked.has(time),
  }));

  res.json(slots);
}
