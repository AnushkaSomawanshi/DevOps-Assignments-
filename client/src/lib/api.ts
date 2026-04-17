import type {
  Appointment,
  Blog,
  BookingData,
  Doctor,
  FilterOptions,
  HealthPackage,
  Hospital,
  TimeSlot,
  User,
} from "@/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;
    throw new Error(payload?.message ?? "Request failed");
  }

  return (await response.json()) as T;
}

export type ApiDoctorsFilter = Pick<FilterOptions, "location" | "speciality">;

export function filterDoctors(
  doctors: Doctor[],
  filter: ApiDoctorsFilter,
): Doctor[] {
  return doctors.filter((doc) => {
    if (
      filter.location &&
      !doc.location.toLowerCase().includes(filter.location.toLowerCase())
    ) {
      return false;
    }
    if (
      filter.speciality &&
      !doc.speciality.toLowerCase().includes(filter.speciality.toLowerCase())
    ) {
      return false;
    }
    return true;
  });
}

export async function fetchDoctors(filter?: ApiDoctorsFilter) {
  const params = new URLSearchParams();
  if (filter?.location) params.set("location", filter.location);
  if (filter?.speciality) params.set("speciality", filter.speciality);
  const query = params.toString();
  return request<Doctor[]>(`/doctors${query ? `?${query}` : ""}`);
}

export async function fetchDoctorById(id: string) {
  return request<Doctor>(`/doctors/${id}`);
}

export async function fetchHospitals() {
  return request<Hospital[]>("/hospitals");
}

export async function fetchPackages() {
  return request<HealthPackage[]>("/packages");
}

export async function fetchBlogs() {
  return request<Blog[]>("/blogs");
}

export async function fetchBlogById(id: string) {
  return request<Blog>(`/blogs/${id}`);
}

export async function fetchUsers(role?: User["role"]) {
  const query = role ? `?role=${encodeURIComponent(role)}` : "";
  return request<User[]>(`/users${query}`);
}

export async function fetchAppointments(params?: {
  patientId?: string;
  doctorId?: string;
  status?: Appointment["status"];
}) {
  const search = new URLSearchParams();
  if (params?.patientId) search.set("patientId", params.patientId);
  if (params?.doctorId) search.set("doctorId", params.doctorId);
  if (params?.status) search.set("status", params.status);
  const query = search.toString();
  return request<Appointment[]>(`/appointments${query ? `?${query}` : ""}`);
}

export async function fetchDoctorAppointments(doctorId: string) {
  return request<Appointment[]>(`/appointments/doctor/${encodeURIComponent(doctorId)}`);
}

export async function fetchAppointmentById(id: string) {
  return request<Appointment>(`/appointments/${id}`);
}

export async function fetchAvailableSlots(doctorId: string, date: string) {
  return request<TimeSlot[]>(
    `/appointments/slots/available?doctorId=${encodeURIComponent(doctorId)}&date=${encodeURIComponent(date)}`,
  );
}

export async function createAppointment(
  payload: Omit<Appointment, "id" | "createdAt">,
) {
  return request<Appointment>("/appointments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function cancelAppointment(id: string) {
  return request<Appointment>(`/appointments/${id}/cancel`, {
    method: "PATCH",
  });
}

export async function updateAppointmentStatus(
  id: string,
  status: Appointment["status"],
) {
  return request<Appointment>(`/appointments/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function loginUser(payload: {
  email: string;
  role: User["role"];
  password?: string;
}) {
  return request<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function registerUser(payload: {
  name: string;
  email: string;
  phone: string;
  role: User["role"];
  password: string;
  abhaId?: string;
  speciality?: string;
  qualifications?: string;
}) {
  return request<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function createAppointmentFromBooking(
  bookingData: BookingData,
  user: User,
  doctors: Doctor[],
  hospitals: Hospital[],
): Omit<Appointment, "id" | "createdAt"> {
  const doctor = doctors.find((d) => d.id === bookingData.doctorId);
  const hospital = hospitals.find((h) => h.id === bookingData.hospitalId);
  return {
    patientId: user.id,
    patientName: user.name,
    doctorId: bookingData.doctorId ?? "",
    doctorName: doctor?.name ?? "",
    hospitalId: bookingData.hospitalId ?? "",
    hospitalName: hospital?.name ?? "",
    department: bookingData.department ?? "",
    date: bookingData.date ?? "",
    timeSlot: bookingData.timeSlot ?? "",
    type: bookingData.type ?? "in-person",
    status: "pending",
    reason: bookingData.reason,
    paymentStatus: "pending",
    amount: doctor?.consultationFee ?? 500,
  };
}
