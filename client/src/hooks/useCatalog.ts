import {
  fetchBlogs,
  fetchHospitals,
  fetchPackages,
  fetchUsers,
} from "@/lib/api";
import type { Blog, HealthPackage, Hospital, User } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useHospitals() {
  return useQuery<Hospital[]>({
    queryKey: ["hospitals"],
    queryFn: fetchHospitals,
  });
}

export function useHealthPackages() {
  return useQuery<HealthPackage[]>({
    queryKey: ["packages"],
    queryFn: fetchPackages,
  });
}

export function useBlogs() {
  return useQuery<Blog[]>({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
  });
}

export function useUsers(role?: User["role"]) {
  return useQuery<User[]>({
    queryKey: ["users", role],
    queryFn: () => fetchUsers(role),
  });
}
