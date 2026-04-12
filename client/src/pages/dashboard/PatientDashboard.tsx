import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppointments, useCancelAppointment } from "@/hooks/useAppointments";
import { useAuth } from "@/hooks/useAuth";
import {
  calculateDueDate,
  calculatePregnancyWeek,
  formatCurrency,
  formatDate,
  formatTime,
} from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  Baby,
  Bell,
  Calendar,
  Clock,
  Download,
  FileText,
  Heart,
  LogOut,
  Plus,
  Settings,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type DashboardTab =
  | "overview"
  | "appointments"
  | "pregnancy"
  | "menstrual"
  | "records"
  | "notifications"
  | "profile";

// ─── Mock data ────────────────────────────────────────────────────────────────

const LMP_DATE = "2025-12-01";

const PREGNANCY_MILESTONES = [
  {
    week: 4,
    title: "Implantation",
    desc: "Embryo implants in the uterine wall",
    trimester: 1,
  },
  {
    week: 8,
    title: "Heartbeat Detected",
    desc: "Baby's heart starts beating regularly",
    trimester: 1,
  },
  {
    week: 12,
    title: "First Trimester Complete",
    desc: "Fingers, toes, and facial features formed",
    trimester: 1,
  },
  {
    week: 16,
    title: "Gender Visible",
    desc: "Baby's gender may be visible on ultrasound",
    trimester: 2,
  },
  {
    week: 20,
    title: "Halfway There",
    desc: "Baby can now hear sounds and move actively",
    trimester: 2,
  },
  {
    week: 24,
    title: "Viability Milestone",
    desc: "Baby could survive with medical support if born now",
    trimester: 2,
  },
  {
    week: 28,
    title: "Third Trimester",
    desc: "Baby opens its eyes and brain develops rapidly",
    trimester: 3,
  },
  {
    week: 36,
    title: "Almost Full-Term",
    desc: "Baby is nearly ready for birth",
    trimester: 3,
  },
  { week: 40, title: "Due Date", desc: "Expected delivery date", trimester: 3 },
];

const MENSTRUAL_CYCLES = [
  {
    id: "mc1",
    startDate: "2026-03-01",
    endDate: "2026-03-05",
    cycleLength: 28,
    flow: "medium" as const,
    symptoms: ["Cramps", "Bloating", "Mood swings"],
  },
  {
    id: "mc2",
    startDate: "2026-02-01",
    endDate: "2026-02-06",
    cycleLength: 29,
    flow: "heavy" as const,
    symptoms: ["Cramps", "Fatigue"],
  },
  {
    id: "mc3",
    startDate: "2026-01-04",
    endDate: "2026-01-08",
    cycleLength: 28,
    flow: "light" as const,
    symptoms: ["Spotting"],
  },
];

const MEDICAL_RECORDS = [
  {
    id: "r1",
    date: "2026-04-01",
    type: "Scan",
    title: "Anomaly Scan Report",
    doctor: "Dr. Meera Joshi",
    hospital: "GyneCare Pune Main",
  },
  {
    id: "r2",
    date: "2026-03-20",
    type: "Blood Report",
    title: "Complete Blood Count",
    doctor: "Lab Technician",
    hospital: "GyneCare Pune Main",
  },
  {
    id: "r3",
    date: "2026-03-01",
    type: "Prescription",
    title: "Prenatal Vitamins Rx",
    doctor: "Dr. Priya Sharma",
    hospital: "GyneCare Pune Main",
  },
  {
    id: "r4",
    date: "2026-02-15",
    type: "Report",
    title: "NT Scan + NIPT Report",
    doctor: "Dr. Meera Joshi",
    hospital: "GyneCare Pune Main",
  },
];

const NOTIFICATIONS = [
  {
    id: "n1",
    type: "appointment" as const,
    title: "Appointment Reminder",
    message: "Your appointment with Dr. Priya Sharma is tomorrow at 10:00 AM.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "n2",
    type: "report" as const,
    title: "Lab Report Ready",
    message: "Your Complete Blood Count report is ready for download.",
    time: "1 day ago",
    read: false,
  },
  {
    id: "n3",
    type: "reminder" as const,
    title: "Prenatal Vitamin Reminder",
    message: "Don't forget to take your prenatal vitamins today.",
    time: "2 days ago",
    read: true,
  },
  {
    id: "n4",
    type: "general" as const,
    title: "Health Tip",
    message:
      "Stay hydrated — drink at least 8-10 glasses of water during pregnancy.",
    time: "3 days ago",
    read: true,
  },
];

// ─── Sidebar nav ──────────────────────────────────────────────────────────────

const NAV_ITEMS: {
  id: DashboardTab;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "appointments", label: "My Appointments", icon: Calendar },
  { id: "pregnancy", label: "Pregnancy Tracker", icon: Baby },
  { id: "menstrual", label: "Menstrual Tracker", icon: Heart },
  { id: "records", label: "Medical Records", icon: FileText },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "profile", label: "Profile Settings", icon: Settings },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const { data: appointments = [], isLoading } = useAppointments(user?.id);
  const cancelAppointment = useCancelAppointment();

  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
    abhaId: "",
  });

  const upcoming = appointments.filter(
    (a) => a.status !== "cancelled" && a.status !== "completed",
  );
  const currentWeek = calculatePregnancyWeek(LMP_DATE);
  const dueDate = calculateDueDate(LMP_DATE);
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  const handleCancel = async (id: string) => {
    await cancelAppointment.mutateAsync(id);
    toast.success("Appointment cancelled");
  };

  return (
    <Layout hideFooter>
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 sticky top-0 z-30">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden h-9 w-9 rounded-lg border border-border flex items-center justify-center"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Activity className="h-4 w-4" />
            </button>
            <div>
              <Badge className="bg-primary/10 text-primary text-xs">
                Patient Portal
              </Badge>
              <h1 className="text-lg font-bold font-display text-foreground mt-0.5">
                Welcome, {user?.name?.split(" ")[0] ?? "Patient"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/book-appointment">
              <Button
                size="sm"
                className="btn-accent gap-1.5 hidden sm:flex"
                type="button"
              >
                <Plus className="h-3.5 w-3.5" />
                Book Appointment
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="gap-1.5"
              type="button"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:sticky top-16 z-20 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border overflow-y-auto transition-transform duration-200 flex-shrink-0`}
        >
          <div className="p-4">
            {/* Profile card */}
            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl mb-5">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                {user?.name?.[0] ?? "P"}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">
                  {user?.name ?? "Patient"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email ?? "patient@email.com"}
                </p>
              </div>
            </div>
            <nav className="space-y-1">
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setActiveTab(id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth text-left relative ${activeTab === id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted/50"}`}
                  data-ocid={`tab-${id}`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {label}
                  {id === "notifications" && unreadCount > 0 && (
                    <span className="ml-auto h-5 w-5 bg-accent text-accent-foreground rounded-full text-[10px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-10 bg-foreground/20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            role="button"
            tabIndex={-1}
            onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
            aria-label="Close sidebar"
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold font-display text-foreground">
                  Dashboard Overview
                </h2>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Upcoming Visits",
                      value: upcoming.length,
                      icon: Calendar,
                      color: "text-primary",
                      bg: "bg-primary/10",
                    },
                    {
                      label: "Pregnancy Week",
                      value: currentWeek,
                      icon: Baby,
                      color: "text-accent",
                      bg: "bg-accent/10",
                    },
                    {
                      label: "Lab Reports",
                      value: MEDICAL_RECORDS.length,
                      icon: FileText,
                      color: "text-primary",
                      bg: "bg-primary/10",
                    },
                    {
                      label: "Notifications",
                      value: unreadCount,
                      icon: Bell,
                      color: "text-accent",
                      bg: "bg-accent/10",
                    },
                  ].map(({ label, value, icon: Icon, color, bg }) => (
                    <Card key={label} className="card-elevated">
                      <CardContent className="p-4 flex flex-col gap-2">
                        <div
                          className={`h-9 w-9 rounded-lg ${bg} flex items-center justify-center`}
                        >
                          <Icon className={`h-4.5 w-4.5 ${color}`} />
                        </div>
                        <p className="text-2xl font-bold text-foreground">
                          {value}
                        </p>
                        <p className="text-xs text-muted-foreground">{label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Upcoming appointment preview */}
                <Card className="card-elevated">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold font-display flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        Upcoming Appointments
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab("appointments")}
                        className="text-xs text-primary hover:underline"
                      >
                        View All
                      </button>
                    </div>
                    {isLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-16 rounded-lg" />
                        <Skeleton className="h-16 rounded-lg" />
                      </div>
                    ) : upcoming.length === 0 ? (
                      <div
                        className="text-center py-8"
                        data-ocid="no-appointments"
                      >
                        <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-30" />
                        <p className="text-sm text-muted-foreground mb-3">
                          No upcoming appointments
                        </p>
                        <Link to="/book-appointment">
                          <Button
                            size="sm"
                            className="btn-primary"
                            type="button"
                          >
                            Book Now
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {upcoming.slice(0, 3).map((apt) => (
                          <div
                            key={apt.id}
                            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                            data-ocid="appointment-row"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-sm text-foreground truncate">
                                {apt.doctorName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {apt.department}
                              </p>
                              <p className="text-xs text-primary font-medium">
                                {formatDate(apt.date)} at{" "}
                                {formatTime(apt.timeSlot)}
                              </p>
                            </div>
                            <Badge
                              variant={
                                apt.status === "confirmed"
                                  ? "default"
                                  : "secondary"
                              }
                              className="ml-3 capitalize"
                            >
                              {apt.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Pregnancy summary */}
                <Card className="card-elevated border-l-4 border-l-accent">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold font-display flex items-center gap-2">
                        <Baby className="h-4 w-4 text-accent" />
                        Pregnancy Tracker
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab("pregnancy")}
                        className="text-xs text-primary hover:underline"
                      >
                        Full Tracker
                      </button>
                    </div>
                    <div className="flex items-center gap-6 mb-4">
                      <div className="h-20 w-20 rounded-full bg-accent/10 flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-3xl font-bold text-accent">
                          {currentWeek}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          weeks
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Due Date:{" "}
                          {dueDate.toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {40 - currentWeek} weeks remaining
                        </p>
                        <div className="w-48 bg-border rounded-full h-2 mt-2">
                          <div
                            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                            style={{ width: `${(currentWeek / 40) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick actions */}
                <Card className="card-elevated">
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-3">Quick Actions</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        {
                          icon: Calendar,
                          label: "Book Appointment",
                          href: "/book-appointment",
                          external: true,
                        },
                        {
                          icon: FileText,
                          label: "Lab Reports",
                          href: "/labs",
                          external: true,
                        },
                        {
                          icon: Heart,
                          label: "Health Packages",
                          href: "/health-packages",
                          external: true,
                        },
                        {
                          icon: Activity,
                          label: "Find Doctors",
                          href: "/find-doctor",
                          external: true,
                        },
                        {
                          icon: Bell,
                          label: "Teleconsult",
                          href: "/teleconsultation",
                          external: true,
                        },
                        {
                          icon: Baby,
                          label: "Pregnancy Tracker",
                          action: "pregnancy",
                        },
                      ].map(({ icon: Icon, label, href, action }) =>
                        href ? (
                          <Link key={label} to={href}>
                            <button
                              type="button"
                              className="w-full flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 text-xs font-medium transition-smooth"
                            >
                              <Icon className="h-5 w-5 text-primary" />
                              {label}
                            </button>
                          </Link>
                        ) : (
                          <button
                            key={label}
                            type="button"
                            onClick={() => setActiveTab(action as DashboardTab)}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-accent hover:bg-accent/5 text-xs font-medium transition-smooth"
                          >
                            <Icon className="h-5 w-5 text-accent" />
                            {label}
                          </button>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* MY APPOINTMENTS */}
            {activeTab === "appointments" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold font-display text-foreground">
                    My Appointments
                  </h2>
                  <Link to="/book-appointment">
                    <Button
                      size="sm"
                      className="btn-primary gap-1.5"
                      type="button"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Book New
                    </Button>
                  </Link>
                </div>

                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 rounded-xl" />
                    ))}
                  </div>
                ) : appointments.length === 0 ? (
                  <Card className="card-elevated">
                    <CardContent
                      className="p-10 text-center"
                      data-ocid="no-appointments-full"
                    >
                      <Calendar className="h-14 w-14 text-muted-foreground mx-auto mb-4 opacity-30" />
                      <p className="font-semibold text-foreground mb-1">
                        No appointments yet
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Book your first appointment with our specialists
                      </p>
                      <Link to="/book-appointment">
                        <Button className="btn-accent" type="button">
                          Book Appointment
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {appointments.map((apt) => (
                      <Card
                        key={apt.id}
                        className="card-elevated"
                        data-ocid="appointment-full-row"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-foreground">
                                  {apt.doctorName}
                                </p>
                                <Badge
                                  variant={
                                    apt.status === "confirmed"
                                      ? "default"
                                      : apt.status === "completed"
                                        ? "secondary"
                                        : apt.status === "cancelled"
                                          ? "destructive"
                                          : "outline"
                                  }
                                  className="capitalize text-xs"
                                >
                                  {apt.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {apt.department} • {apt.hospitalName}
                              </p>
                              <p className="text-sm text-primary font-medium mt-1">
                                {formatDate(apt.date)} at{" "}
                                {formatTime(apt.timeSlot)}
                              </p>
                              {apt.reason && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Reason: {apt.reason}
                                </p>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-sm font-semibold text-foreground">
                                {formatCurrency(apt.amount)}
                              </p>
                              <Badge
                                variant={
                                  apt.paymentStatus === "paid"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-[10px] mt-1"
                              >
                                {apt.paymentStatus}
                              </Badge>
                            </div>
                          </div>
                          {apt.status !== "cancelled" &&
                            apt.status !== "completed" && (
                              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs flex-1"
                                  type="button"
                                >
                                  Reschedule
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="text-xs flex-1"
                                  type="button"
                                  onClick={() => handleCancel(apt.id)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PREGNANCY TRACKER */}
            {activeTab === "pregnancy" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold font-display text-foreground">
                  Pregnancy Tracker
                </h2>

                {/* Week display */}
                <Card className="card-elevated bg-gradient-to-br from-accent/5 to-primary/5 border-accent/30">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-8">
                      <div className="h-28 w-28 rounded-full bg-accent/10 border-4 border-accent/30 flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-5xl font-bold text-accent">
                          {currentWeek}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">
                          WEEKS
                        </span>
                      </div>
                      <div>
                        <p className="text-lg font-bold font-display text-foreground">
                          Week {currentWeek} of 40
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Baby is the size of an ear of corn
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Due:{" "}
                          {dueDate.toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        <div className="mt-3 w-64 bg-border rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-smooth"
                            style={{ width: `${(currentWeek / 40) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5">
                          {40 - currentWeek} weeks to go •{" "}
                          {currentWeek <= 12
                            ? "1st Trimester"
                            : currentWeek <= 28
                              ? "2nd Trimester"
                              : "3rd Trimester"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Milestones by trimester */}
                {[1, 2, 3].map((trimester) => (
                  <Card key={trimester} className="card-elevated">
                    <CardContent className="p-5">
                      <h3 className="font-bold font-display mb-4 flex items-center gap-2">
                        <Baby className="h-4 w-4 text-accent" />
                        {trimester === 1
                          ? "1st Trimester (Weeks 1–12)"
                          : trimester === 2
                            ? "2nd Trimester (Weeks 13–28)"
                            : "3rd Trimester (Weeks 29–40)"}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {PREGNANCY_MILESTONES.filter(
                          (m) => m.trimester === trimester,
                        ).map((m) => (
                          <div
                            key={m.week}
                            className={`p-3 rounded-lg border transition-smooth ${m.week <= currentWeek ? "border-primary/30 bg-primary/5" : "border-border bg-muted/20 opacity-60"}`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {m.week <= currentWeek ? (
                                <span className="h-5 w-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-[10px] text-primary-foreground font-bold">
                                    ✓
                                  </span>
                                </span>
                              ) : (
                                <span className="h-5 w-5 border-2 border-border rounded-full flex-shrink-0" />
                              )}
                              <span className="text-xs font-bold text-muted-foreground">
                                Week {m.week}
                              </span>
                            </div>
                            <p className="font-semibold text-sm text-foreground">
                              {m.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {m.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Add note */}
                <Card className="card-elevated">
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Plus className="h-4 w-4 text-primary" />
                      Add Week Note
                    </h3>
                    <div className="space-y-3">
                      <textarea
                        className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background resize-none focus:ring-2 focus:ring-primary outline-none"
                        rows={3}
                        placeholder="How are you feeling this week? Any symptoms or notes..."
                        data-ocid="pregnancy-note-input"
                      />
                      <Button
                        size="sm"
                        className="btn-primary"
                        type="button"
                        data-ocid="add-pregnancy-note-btn"
                      >
                        Save Note
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* MENSTRUAL TRACKER */}
            {activeTab === "menstrual" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold font-display text-foreground">
                  Menstrual Cycle Tracker
                </h2>

                {/* Next period prediction */}
                <Card className="card-elevated border-l-4 border-l-accent">
                  <CardContent className="p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          Next Period
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          Apr 29, 2026
                        </p>
                        <p className="text-xs text-muted-foreground">
                          In 19 days
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          Fertile Window
                        </p>
                        <p className="text-lg font-bold text-accent">
                          Apr 14–18
                        </p>
                        <p className="text-xs text-muted-foreground">5 days</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          Avg Cycle Length
                        </p>
                        <p className="text-lg font-bold text-primary">
                          28 days
                        </p>
                        <p className="text-xs text-muted-foreground">Regular</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cycle history */}
                <Card className="card-elevated">
                  <CardContent className="p-5">
                    <h3 className="font-bold font-display mb-4">
                      Cycle History
                    </h3>
                    <div className="space-y-3">
                      {MENSTRUAL_CYCLES.map((cycle) => (
                        <div
                          key={cycle.id}
                          className="p-4 bg-muted/30 rounded-xl"
                          data-ocid="cycle-row"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-sm text-foreground">
                                {formatDate(cycle.startDate)} —{" "}
                                {cycle.endDate
                                  ? formatDate(cycle.endDate)
                                  : "Ongoing"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Cycle: {cycle.cycleLength} days
                              </p>
                            </div>
                            <Badge
                              variant={
                                cycle.flow === "heavy"
                                  ? "destructive"
                                  : cycle.flow === "light"
                                    ? "secondary"
                                    : "default"
                              }
                              className="capitalize text-xs"
                            >
                              {cycle.flow} flow
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {cycle.symptoms.map((s) => (
                              <span
                                key={s}
                                className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Log new cycle */}
                <Card className="card-elevated">
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Plus className="h-4 w-4 text-primary" />
                      Log New Cycle
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cycle-start">Start Date</Label>
                        <Input
                          id="cycle-start"
                          type="date"
                          className="mt-1"
                          data-ocid="cycle-start-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cycle-end">End Date</Label>
                        <Input
                          id="cycle-end"
                          type="date"
                          className="mt-1"
                          data-ocid="cycle-end-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="flow-level">Flow</Label>
                        <select
                          id="flow-level"
                          className="mt-1 w-full h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                          data-ocid="flow-select"
                        >
                          <option value="light">Light</option>
                          <option value="medium">Medium</option>
                          <option value="heavy">Heavy</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="symptoms">Symptoms</Label>
                        <Input
                          id="symptoms"
                          placeholder="Cramps, Bloating..."
                          className="mt-1"
                          data-ocid="symptoms-input"
                        />
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="btn-primary mt-4"
                      type="button"
                      data-ocid="log-cycle-btn"
                    >
                      Log Cycle
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* MEDICAL RECORDS */}
            {activeTab === "records" && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold font-display text-foreground">
                  Medical Records
                </h2>
                <Card className="card-elevated">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/30">
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Date
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Type
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Report
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Doctor
                            </th>
                            <th className="text-right px-4 py-3 font-semibold text-muted-foreground">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {MEDICAL_RECORDS.map((rec) => (
                            <tr
                              key={rec.id}
                              className="border-b border-border hover:bg-muted/20 transition-colors"
                              data-ocid="record-row"
                            >
                              <td className="px-4 py-3 text-muted-foreground">
                                {formatDate(rec.date)}
                              </td>
                              <td className="px-4 py-3">
                                <Badge variant="secondary" className="text-xs">
                                  {rec.type}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 font-medium text-foreground">
                                {rec.title}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground text-xs">
                                {rec.doctor}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1.5 text-xs"
                                  type="button"
                                  data-ocid="download-btn"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                  Download
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold font-display text-foreground">
                  Notifications
                </h2>
                <div className="space-y-3">
                  {NOTIFICATIONS.map((notif) => (
                    <Card
                      key={notif.id}
                      className={`card-elevated ${!notif.read ? "border-primary/30" : ""}`}
                      data-ocid="notification-row"
                    >
                      <CardContent className="p-4 flex items-start gap-3">
                        <div
                          className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 ${!notif.read ? "bg-primary/10" : "bg-muted"}`}
                        >
                          {notif.type === "appointment" && (
                            <Calendar
                              className={`h-4 w-4 ${!notif.read ? "text-primary" : "text-muted-foreground"}`}
                            />
                          )}
                          {notif.type === "report" && (
                            <FileText
                              className={`h-4 w-4 ${!notif.read ? "text-primary" : "text-muted-foreground"}`}
                            />
                          )}
                          {notif.type === "reminder" && (
                            <Clock
                              className={`h-4 w-4 ${!notif.read ? "text-accent" : "text-muted-foreground"}`}
                            />
                          )}
                          {notif.type === "general" && (
                            <Bell
                              className={`h-4 w-4 ${!notif.read ? "text-accent" : "text-muted-foreground"}`}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-sm text-foreground">
                              {notif.title}
                            </p>
                            {!notif.read && (
                              <span className="h-2 w-2 bg-accent rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {notif.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notif.time}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* PROFILE SETTINGS */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold font-display text-foreground">
                  Profile Settings
                </h2>
                <Card className="card-elevated">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                      <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                        {user?.name?.[0] ?? "P"}
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-lg font-display">
                          {user?.name}
                        </p>
                        <Badge className="bg-primary/10 text-primary mt-1">
                          Patient
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="profile-name">Full Name</Label>
                        <Input
                          id="profile-name"
                          value={profileForm.name}
                          onChange={(e) =>
                            setProfileForm((f) => ({
                              ...f,
                              name: e.target.value,
                            }))
                          }
                          className="mt-1"
                          data-ocid="profile-name-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="profile-phone">Phone Number</Label>
                        <Input
                          id="profile-phone"
                          value={profileForm.phone}
                          onChange={(e) =>
                            setProfileForm((f) => ({
                              ...f,
                              phone: e.target.value,
                            }))
                          }
                          className="mt-1"
                          data-ocid="profile-phone-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="profile-email">Email Address</Label>
                        <Input
                          id="profile-email"
                          type="email"
                          value={profileForm.email}
                          onChange={(e) =>
                            setProfileForm((f) => ({
                              ...f,
                              email: e.target.value,
                            }))
                          }
                          className="mt-1"
                          data-ocid="profile-email-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="profile-abha">ABHA ID (optional)</Label>
                        <Input
                          id="profile-abha"
                          value={profileForm.abhaId}
                          onChange={(e) =>
                            setProfileForm((f) => ({
                              ...f,
                              abhaId: e.target.value,
                            }))
                          }
                          placeholder="00-0000-0000-0000"
                          className="mt-1"
                          data-ocid="profile-abha-input"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6 pt-5 border-t border-border">
                      <Button
                        className="btn-primary"
                        type="button"
                        onClick={() =>
                          toast.success("Profile updated successfully!")
                        }
                        data-ocid="save-profile-btn"
                      >
                        Save Changes
                      </Button>
                      <Button variant="outline" type="button">
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Account section */}
                <Card className="card-elevated">
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      Account
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm text-foreground">Role</span>
                        <Badge className="bg-primary/10 text-primary">
                          Patient
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm text-foreground">
                          Member Since
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Jan 2026
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-4 gap-1.5"
                      type="button"
                      onClick={logout}
                      data-ocid="signout-btn"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
}
