// Auth helpers using the authorization extension pattern
// Wraps Internet Identity auth state for role-based access control

import type { UserRole } from "@/types";

export const ROLE_STORAGE_KEY = "gynecare_user_role";
export const USER_STORAGE_KEY = "gynecare_user_data";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
}

export function getStoredUser(): StoredUser | null {
  try {
    const raw = sessionStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: StoredUser): void {
  sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  sessionStorage.removeItem(USER_STORAGE_KEY);
  sessionStorage.removeItem(ROLE_STORAGE_KEY);
}

export function getDashboardRoute(role: UserRole): string {
  const routes: Record<UserRole, string> = {
    patient: "/dashboard/patient",
    doctor: "/dashboard/doctor",
    admin: "/dashboard/admin",
  };
  return routes[role];
}

export function canAccess(
  userRole: UserRole | null,
  requiredRoles: UserRole[],
): boolean {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
}

export function isProtectedRoute(path: string): boolean {
  return path.startsWith("/dashboard");
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    patient: "Patient",
    doctor: "Doctor",
    admin: "Administrator",
  };
  return labels[role];
}

export function getRoleBadgeColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    patient: "bg-secondary text-secondary-foreground",
    doctor: "bg-primary/10 text-primary",
    admin: "bg-accent/10 text-accent",
  };
  return colors[role];
}

// OTP simulation (in production, integrate with SMS gateway)
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function validateOTP(input: string, expected: string): boolean {
  return input.trim() === expected.trim();
}
