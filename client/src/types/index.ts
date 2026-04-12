// ─── User & Auth ────────────────────────────────────────────────────────────

export type UserRole = "patient" | "doctor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  abhaId?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── Doctor ──────────────────────────────────────────────────────────────────

export interface Doctor {
  id: string;
  name: string;
  speciality: string;
  qualification: string;
  experience: number;
  rating: number;
  reviewCount: number;
  hospitalId: string;
  hospitalName: string;
  location: string;
  imageUrl: string;
  bio: string;
  consultationFee: number;
  availableDays: string[];
  languages: string[];
  expertise: string[];
}

// ─── Hospital ─────────────────────────────────────────────────────────────────

export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  imageUrl: string;
  facilities: string[];
  bedCapacity: number;
  doctorCount: number;
  emergencyAvailable: boolean;
  coordinates: { lat: number; lng: number };
}

// ─── Appointment ─────────────────────────────────────────────────────────────

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export type AppointmentType = "in-person" | "teleconsultation";

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  hospitalId: string;
  hospitalName: string;
  department: string;
  date: string;
  timeSlot: string;
  type: AppointmentType;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  prescription?: string;
  paymentStatus: "pending" | "paid";
  amount: number;
  createdAt: string;
}

export interface BookingStep {
  step: number;
  label: string;
  completed: boolean;
}

export interface BookingData {
  locationId?: string;
  hospitalId?: string;
  department?: string;
  doctorId?: string;
  date?: string;
  timeSlot?: string;
  type?: AppointmentType;
  reason?: string;
}

// ─── Health Package ───────────────────────────────────────────────────────────

export interface HealthPackage {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  description: string;
  tests: string[];
  testCount: number;
  imageUrl: string;
  popular: boolean;
  gender: "female" | "male" | "both";
  ageGroup?: string;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorRole: string;
  imageUrl: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
}

// ─── Testimonial ──────────────────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  patientName: string;
  patientLocation: string;
  quote: string;
  rating: number;
  treatment: string;
  avatar?: string;
  date: string;
}

// ─── Medical Record ───────────────────────────────────────────────────────────

export interface MedicalRecord {
  id: string;
  patientId: string;
  type: "prescription" | "report" | "scan" | "discharge";
  title: string;
  description?: string;
  fileUrl?: string;
  uploadedBy: string;
  uploadedAt: string;
  appointmentId?: string;
}

// ─── Pregnancy Tracker ────────────────────────────────────────────────────────

export interface PregnancyTracker {
  id: string;
  patientId: string;
  lmpDate: string;
  dueDate: string;
  currentWeek: number;
  babySize: string;
  babyWeight: string;
  milestones: PregnancyMilestone[];
}

export interface PregnancyMilestone {
  week: number;
  title: string;
  description: string;
  tips: string[];
  completed: boolean;
}

// ─── Menstrual Tracker ────────────────────────────────────────────────────────

export interface MenstrualCycle {
  id: string;
  patientId: string;
  startDate: string;
  endDate?: string;
  cycleLength: number;
  periodLength: number;
  flow: "light" | "medium" | "heavy";
  symptoms: string[];
  notes?: string;
}

// ─── Lab Report ───────────────────────────────────────────────────────────────

export interface LabReport {
  id: string;
  patientId: string;
  reportName: string;
  testDate: string;
  reportUrl: string;
  status: "pending" | "ready" | "delivered";
  hospitalId: string;
}

// ─── Blood Bank ───────────────────────────────────────────────────────────────

export interface BloodAvailability {
  bloodGroup: string;
  units: number;
  hospitalId: string;
  hospitalName: string;
  lastUpdated: string;
}

// ─── Speciality ───────────────────────────────────────────────────────────────

export interface Speciality {
  id: string;
  name: string;
  icon: string;
  description: string;
  doctorCount: number;
  highlighted: boolean;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "appointment" | "report" | "reminder" | "general";
  read: boolean;
  createdAt: string;
}

// ─── Common ───────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface FilterOptions {
  location?: string;
  speciality?: string;
  hospital?: string;
  dateRange?: { from: string; to: string };
}
