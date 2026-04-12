import { Layout } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthProvider } from "@/contexts/AuthContext";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// ─── Lazy page imports ────────────────────────────────────────────────────────

const HomePage = lazy(() => import("@/pages/Home"));
const HospitalsPage = lazy(() => import("@/pages/Hospitals"));
const SpecialitiesPage = lazy(() => import("@/pages/Specialities"));
const FindDoctorPage = lazy(() => import("@/pages/FindDoctor"));
const HealthPackagesPage = lazy(() => import("@/pages/HealthPackages"));
const BlogsPage = lazy(() => import("@/pages/Blogs"));
const BlogDetailPage = lazy(() => import("@/pages/BlogDetail"));
const AboutPage = lazy(() => import("@/pages/About"));
const ContactPage = lazy(() => import("@/pages/Contact"));
const InternationalPatientsPage = lazy(
  () => import("@/pages/InternationalPatients"),
);
const LabsPage = lazy(() => import("@/pages/Labs"));
const BloodAvailabilityPage = lazy(() => import("@/pages/BloodAvailability"));
const AcademicsCsrPage = lazy(() => import("@/pages/AcademicsCsr"));
const CareerPage = lazy(() => import("@/pages/Career"));
const SecondOpinionPage = lazy(() => import("@/pages/SecondOpinion"));
const BookAppointmentPage = lazy(() => import("@/pages/BookAppointment"));
const TeleconsultationPage = lazy(() => import("@/pages/Teleconsultation"));
const LoginPage = lazy(() => import("@/pages/Login"));
const RegisterPage = lazy(() => import("@/pages/Register"));
const PatientDashboardPage = lazy(
  () => import("@/pages/dashboard/PatientDashboard"),
);
const DoctorDashboardPage = lazy(
  () => import("@/pages/dashboard/DoctorDashboard"),
);
const AdminDashboardPage = lazy(
  () => import("@/pages/dashboard/AdminDashboard"),
);
const VideosPage = lazy(() => import("@/pages/Videos"));

// ─── Auth guard helper ────────────────────────────────────────────────────────

function getStoredUserRole(): string | null {
  try {
    const raw = sessionStorage.getItem("gynecare_user_data");
    if (!raw) return null;
    const user = JSON.parse(raw) as { role: string };
    return user.role;
  } catch {
    return null;
  }
}

// ─── Page loading fallback ────────────────────────────────────────────────────

function PageLoader() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 space-y-6">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-8 w-1/2 rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
        </div>
      </div>
    </Layout>
  );
}

function SuspensePage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

// ─── Routes ───────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <SuspensePage>
      <HomePage />
    </SuspensePage>
  ),
});

const hospitalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hospitals",
  component: () => (
    <SuspensePage>
      <HospitalsPage />
    </SuspensePage>
  ),
});

const specialitiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/specialities",
  component: () => (
    <SuspensePage>
      <SpecialitiesPage />
    </SuspensePage>
  ),
});

const findDoctorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/find-doctor",
  component: () => (
    <SuspensePage>
      <FindDoctorPage />
    </SuspensePage>
  ),
});

const healthPackagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/health-packages",
  component: () => (
    <SuspensePage>
      <HealthPackagesPage />
    </SuspensePage>
  ),
});

const blogsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blogs",
  component: () => (
    <SuspensePage>
      <BlogsPage />
    </SuspensePage>
  ),
});

const blogDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blogs/$id",
  component: () => (
    <SuspensePage>
      <BlogDetailPage />
    </SuspensePage>
  ),
});

const videosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/videos",
  component: () => (
    <SuspensePage>
      <VideosPage />
    </SuspensePage>
  ),
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: () => (
    <SuspensePage>
      <AboutPage />
    </SuspensePage>
  ),
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: () => (
    <SuspensePage>
      <ContactPage />
    </SuspensePage>
  ),
});

const internationalPatientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/international-patients",
  component: () => (
    <SuspensePage>
      <InternationalPatientsPage />
    </SuspensePage>
  ),
});

const labsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/labs",
  component: () => (
    <SuspensePage>
      <LabsPage />
    </SuspensePage>
  ),
});

const bloodAvailabilityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blood-availability",
  component: () => (
    <SuspensePage>
      <BloodAvailabilityPage />
    </SuspensePage>
  ),
});

const academicsCsrRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/academics-csr",
  component: () => (
    <SuspensePage>
      <AcademicsCsrPage />
    </SuspensePage>
  ),
});

const careerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/career",
  component: () => (
    <SuspensePage>
      <CareerPage />
    </SuspensePage>
  ),
});

const secondOpinionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/second-opinion",
  component: () => (
    <SuspensePage>
      <SecondOpinionPage />
    </SuspensePage>
  ),
});

const bookAppointmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/book-appointment",
  component: () => (
    <SuspensePage>
      <BookAppointmentPage />
    </SuspensePage>
  ),
});

const teleconsultationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/teleconsultation",
  component: () => (
    <SuspensePage>
      <TeleconsultationPage />
    </SuspensePage>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <SuspensePage>
      <LoginPage />
    </SuspensePage>
  ),
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: () => (
    <SuspensePage>
      <RegisterPage />
    </SuspensePage>
  ),
});

// Protected routes
const patientDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/patient",
  beforeLoad: () => {
    const role = getStoredUserRole();
    if (!role) throw redirect({ to: "/login" });
    if (role !== "patient") throw redirect({ to: "/" });
  },
  component: () => (
    <SuspensePage>
      <PatientDashboardPage />
    </SuspensePage>
  ),
});

const doctorDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/doctor",
  beforeLoad: () => {
    const role = getStoredUserRole();
    if (!role) throw redirect({ to: "/login" });
    if (role !== "doctor") throw redirect({ to: "/" });
  },
  component: () => (
    <SuspensePage>
      <DoctorDashboardPage />
    </SuspensePage>
  ),
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/admin",
  beforeLoad: () => {
    const role = getStoredUserRole();
    if (!role) throw redirect({ to: "/login" });
    if (role !== "admin") throw redirect({ to: "/" });
  },
  component: () => (
    <SuspensePage>
      <AdminDashboardPage />
    </SuspensePage>
  ),
});

// ─── Router ───────────────────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  indexRoute,
  hospitalsRoute,
  specialitiesRoute,
  findDoctorRoute,
  healthPackagesRoute,
  blogsRoute,
  blogDetailRoute,
  videosRoute,
  aboutRoute,
  contactRoute,
  internationalPatientsRoute,
  labsRoute,
  bloodAvailabilityRoute,
  academicsCsrRoute,
  careerRoute,
  secondOpinionRoute,
  bookAppointmentRoute,
  teleconsultationRoute,
  loginRoute,
  registerRoute,
  patientDashboardRoute,
  doctorDashboardRoute,
  adminDashboardRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
