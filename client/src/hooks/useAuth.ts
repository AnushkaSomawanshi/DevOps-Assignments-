import { useAuthContext } from "@/contexts/AuthContext";
import { getDashboardRoute } from "@/lib/auth";

// Re-export the auth context hook with convenience helpers
export function useAuth() {
  const ctx = useAuthContext();

  return {
    ...ctx,
    dashboardRoute: ctx.role ? getDashboardRoute(ctx.role) : "/login",
    isPatient: ctx.role === "patient",
    isDoctor: ctx.role === "doctor",
    isAdmin: ctx.role === "admin",
  };
}

export default useAuth;
