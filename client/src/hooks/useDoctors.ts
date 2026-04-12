import {
  type ApiDoctorsFilter,
  fetchDoctorById,
  fetchDoctors,
} from "@/lib/api";
import type { Doctor } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useDoctors(filter?: ApiDoctorsFilter) {
  return useQuery<Doctor[]>({
    queryKey: ["doctors", filter],
    queryFn: () => fetchDoctors(filter),
  });
}

export function useDoctorById(id: string) {
  return useQuery<Doctor | null>({
    queryKey: ["doctor", id],
    queryFn: async () => (id ? fetchDoctorById(id) : null),
    enabled: !!id,
  });
}

export function useTopDoctors(limit = 4) {
  return useQuery<Doctor[]>({
    queryKey: ["top-doctors", limit],
    queryFn: async () => {
      const doctors = await fetchDoctors();
      return [...doctors].sort((a, b) => b.rating - a.rating).slice(0, limit);
    },
  });
}

export function useSpecialities() {
  return useQuery<string[]>({
    queryKey: ["specialities"],
    queryFn: async () => {
      const doctors = await fetchDoctors();
      return [...new Set(doctors.map((doctor) => doctor.speciality))];
    },
  });
}

export function useDoctorLocations() {
  return useQuery<string[]>({
    queryKey: ["doctor-locations"],
    queryFn: async () => {
      const doctors = await fetchDoctors();
      return [...new Set(doctors.map((doctor) => doctor.location))];
    },
  });
}
