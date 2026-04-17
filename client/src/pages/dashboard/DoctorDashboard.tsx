import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useDoctorAppointments } from "@/hooks/useAppointments";
import { useAuth } from "@/hooks/useAuth";
import { useDoctors } from "@/hooks/useDoctors";
import { formatDate, formatTime } from "@/lib/utils";
import {
  Activity,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  LogOut,
  Plus,
  Settings,
  Upload,
  User,
  Users,
  Video,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type DoctorTab =
  | "today"
  | "patients"
  | "upload-prescription"
  | "rx-history"
  | "profile";

// ─── Mock data ────────────────────────────────────────────────────────────────

const ALL_APPOINTMENTS_TODAY = [
  {
    id: "t1",
    patientName: "Prachi Desai",
    time: "09:30",
    dept: "Obstetrics & Gynecology",
    status: "confirmed",
    reason: "Regular prenatal checkup",
  },
  {
    id: "t2",
    patientName: "Meera Kulkarni",
    time: "10:00",
    dept: "Obstetrics & Gynecology",
    status: "confirmed",
    reason: "First trimester scan review",
  },
  {
    id: "t3",
    patientName: "Sunita Patil",
    time: "11:00",
    dept: "IVF & Fertility",
    status: "pending",
    reason: "IVF pre-consultation",
  },
  {
    id: "t4",
    patientName: "Rekha Sharma",
    time: "14:00",
    dept: "Obstetrics & Gynecology",
    status: "confirmed",
    reason: "Postpartum followup",
  },
  {
    id: "t5",
    patientName: "Ananya Joshi",
    time: "15:30",
    dept: "Maternal-Fetal Medicine",
    status: "pending",
    reason: "Anomaly scan discussion",
  },
];

const ALL_PATIENTS = [
  {
    id: "p1",
    name: "Prachi Desai",
    phone: "+91 98765 11111",
    lastVisit: "2026-04-08",
    totalVisits: 4,
  },
  {
    id: "p2",
    name: "Meera Kulkarni",
    phone: "+91 98765 22222",
    lastVisit: "2026-04-05",
    totalVisits: 2,
  },
  {
    id: "p3",
    name: "Sunita Patil",
    phone: "+91 98765 33333",
    lastVisit: "2026-03-28",
    totalVisits: 6,
  },
  {
    id: "p4",
    name: "Rekha Sharma",
    phone: "+91 98765 44444",
    lastVisit: "2026-03-20",
    totalVisits: 3,
  },
  {
    id: "p5",
    name: "Ananya Joshi",
    phone: "+91 98765 55555",
    lastVisit: "2026-03-10",
    totalVisits: 1,
  },
  {
    id: "p6",
    name: "Kavita Deshmukh",
    phone: "+91 98765 66666",
    lastVisit: "2026-02-28",
    totalVisits: 8,
  },
];

const PRESCRIPTION_HISTORY = [
  {
    id: "rx1",
    patient: "Prachi Desai",
    date: "2026-04-08",
    fileName: "rx_prachi_08apr.pdf",
    notes: "Prenatal vitamins & iron",
  },
  {
    id: "rx2",
    patient: "Meera Kulkarni",
    date: "2026-04-05",
    fileName: "rx_meera_05apr.pdf",
    notes: "Progesterone support",
  },
  {
    id: "rx3",
    patient: "Sunita Patil",
    date: "2026-03-28",
    fileName: "rx_sunita_28mar.pdf",
    notes: "PCOS management protocol",
  },
];

// ─── Status badge helper ──────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant={
        status === "confirmed"
          ? "default"
          : status === "completed"
            ? "secondary"
            : "outline"
      }
      className="capitalize text-xs"
    >
      {status}
    </Badge>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const { data: doctors = [] } = useDoctors();

  const resolvedDoctorId =
    user?.doctorId ??
    user?._id ??
    doctors.find((doctor) => doctor.name === user?.name)?.id;

  const doctorInfo =
    doctors.find((doctor) => doctor.id === resolvedDoctorId) ??
    doctors.find((doctor) => doctor.name === user?.name) ??
    doctors.find((doctor) => doctor.id === "d1") ??
    doctors[0];

  const { data: doctorAppointments = [], isLoading } = useDoctorAppointments(
    resolvedDoctorId ?? doctorInfo?.id,
  );

  const [activeTab, setActiveTab] = useState<DoctorTab>("today");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [selectedPatient, setSelectedPatient] = useState("");
  const [rxNotes, setRxNotes] = useState("");
  const [rxDate, setRxDate] = useState("");
  const [profileForm, setProfileForm] = useState({
    qualifications: "MD, DGO, FRCOG",
    experience: "18 years",
    bio: "Specialist in high-risk pregnancies and minimally invasive surgeries.",
    availableHours: "Mon, Wed, Fri: 9AM–5PM",
    hospital: "GyneCare Hospital — Pune Main",
  });

  const completedToday = completedIds.size;
  const pendingCount = doctorAppointments.filter(
    (a) => a.status === "pending",
  ).length;

  const NAV_ITEMS: { id: DoctorTab; label: string; icon: React.ElementType }[] =
    [
      { id: "today", label: "Today's Appointments", icon: Calendar },
      { id: "patients", label: "Patient List", icon: Users },
      { id: "upload-prescription", label: "Upload Prescription", icon: Upload },
      { id: "rx-history", label: "Prescription History", icon: FileText },
      { id: "profile", label: "My Profile", icon: Settings },
    ];

  const handleMarkComplete = (id: string) => {
    setCompletedIds((prev) => new Set([...prev, id]));
    toast.success("Appointment marked as complete");
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
                Doctor Portal
              </Badge>
              <h1 className="text-lg font-bold font-display text-foreground mt-0.5">
                Dr. {user?.name?.split(" ").slice(1).join(" ") ?? "Doctor"}
              </h1>
            </div>
          </div>
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

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:sticky top-16 z-20 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border overflow-y-auto transition-transform duration-200 flex-shrink-0`}
        >
          <div className="p-4">
            {/* Doctor card */}
            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl mb-5">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                {user?.name?.[0] ?? "D"}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">
                  {user?.name ?? doctorInfo?.name ?? "Doctor"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {doctorInfo?.speciality ?? "Doctor"}
                </p>
              </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { label: "Today", value: doctorAppointments.length },
                { label: "Done", value: completedToday },
                { label: "Pending", value: pendingCount },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="text-center bg-muted/30 rounded-lg p-2"
                >
                  <p className="font-bold text-foreground">{value}</p>
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                </div>
              ))}
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
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth text-left ${activeTab === id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted/50"}`}
                  data-ocid={`tab-${id}`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Overlay */}
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
            {/* TODAY'S APPOINTMENTS */}
            {activeTab === "today" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold font-display text-foreground">
                    Today's Appointments
                  </h2>
                  <Badge variant="secondary">
                    {doctorAppointments.length} scheduled
                  </Badge>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      icon: Calendar,
                      label: "Total Today",
                      value: doctorAppointments.length,
                      color: "text-primary",
                      bg: "bg-primary/10",
                    },
                    {
                      icon: CheckCircle,
                      label: "Completed",
                      value: completedToday,
                      color: "text-primary",
                      bg: "bg-primary/10",
                    },
                    {
                      icon: Clock,
                      label: "Pending",
                      value: pendingCount,
                      color: "text-accent",
                      bg: "bg-accent/10",
                    },
                    {
                      icon: Users,
                      label: "Total Patients",
                      value: ALL_PATIENTS.length,
                      color: "text-accent",
                      bg: "bg-accent/10",
                    },
                  ].map(({ icon: Icon, label, value, color, bg }) => (
                    <Card key={label} className="card-elevated">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div
                          className={`h-9 w-9 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className={`h-4 w-4 ${color}`} />
                        </div>
                        <div>
                          <p className="text-xl font-bold text-foreground">
                            {value}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {label}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Appointment list */}
                <Card className="card-elevated">
                  <CardContent className="p-5">
                    {isLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-20 rounded-xl" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {doctorAppointments.map((apt) => {
                          const isDone = completedIds.has(apt.id);
                          return (
                            <div
                              key={apt.id}
                              className={`p-4 rounded-xl border transition-smooth ${isDone ? "border-border bg-muted/20 opacity-60" : "border-border hover:border-primary/30 hover:bg-primary/2"}`}
                              data-ocid="today-appointment-row"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-semibold text-foreground">
                                      {apt.patientName}
                                    </p>
                                    {isDone ? (
                                      <Badge className="bg-primary/10 text-primary text-xs">
                                        Completed
                                      </Badge>
                                    ) : (
                                      <StatusBadge status={apt.status} />
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {apt.department}
                                  </p>
                                  <p className="text-sm text-primary font-medium mt-1 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatTime(apt.timeSlot)} ·{" "}
                                    {formatDate(apt.date)}
                                  </p>
                                  {apt.reason && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      "{apt.reason}"
                                    </p>
                                  )}
                                </div>
                                {!isDone && (
                                  <div className="flex flex-col gap-2 flex-shrink-0">
                                    <Button
                                      size="sm"
                                      className="btn-primary gap-1 text-xs"
                                      type="button"
                                      onClick={() => handleMarkComplete(apt.id)}
                                      data-ocid="mark-complete-btn"
                                    >
                                      <CheckCircle className="h-3 w-3" /> Mark
                                      Done
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="gap-1 text-xs border-accent text-accent hover:bg-accent/5"
                                      type="button"
                                      data-ocid="start-teleconsult-btn"
                                    >
                                      <Video className="h-3 w-3" /> Teleconsult
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        {doctorAppointments.length === 0 && (
                          <p
                            className="text-center py-10 text-muted-foreground"
                            data-ocid="no-doctor-appointments"
                          >
                            No appointments scheduled for today
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* PATIENT LIST */}
            {activeTab === "patients" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold font-display text-foreground">
                    Patient List
                  </h2>
                  <Badge variant="secondary">
                    {ALL_PATIENTS.length} patients
                  </Badge>
                </div>
                <Card className="card-elevated">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/30">
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Patient
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Phone
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Last Visit
                            </th>
                            <th className="text-right px-4 py-3 font-semibold text-muted-foreground">
                              Visits
                            </th>
                            <th className="text-right px-4 py-3 font-semibold text-muted-foreground">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {ALL_PATIENTS.map((pat) => (
                            <tr
                              key={pat.id}
                              className="border-b border-border hover:bg-muted/20 transition-colors"
                              data-ocid="patient-row"
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-bold text-primary">
                                      {pat.name[0]}
                                    </span>
                                  </div>
                                  <span className="font-medium text-foreground">
                                    {pat.name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {pat.phone}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {formatDate(pat.lastVisit)}
                              </td>
                              <td className="px-4 py-3 text-right font-semibold text-foreground">
                                {pat.totalVisits}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                  type="button"
                                  data-ocid="view-history-btn"
                                >
                                  View History
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

            {/* UPLOAD PRESCRIPTION */}
            {activeTab === "upload-prescription" && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold font-display text-foreground">
                  Upload Prescription
                </h2>
                <Card className="card-elevated">
                  <CardContent className="p-6">
                    <div className="space-y-5">
                      <div>
                        <Label htmlFor="rx-patient">Select Patient</Label>
                        <select
                          id="rx-patient"
                          value={selectedPatient}
                          onChange={(e) => setSelectedPatient(e.target.value)}
                          className="mt-1 w-full h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                          data-ocid="rx-patient-select"
                        >
                          <option value="">-- Select patient --</option>
                          {ALL_PATIENTS.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="rx-date">Date</Label>
                        <Input
                          id="rx-date"
                          type="date"
                          value={rxDate}
                          onChange={(e) => setRxDate(e.target.value)}
                          className="mt-1"
                          data-ocid="rx-date-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rx-notes">Prescription Notes</Label>
                        <Textarea
                          id="rx-notes"
                          value={rxNotes}
                          onChange={(e) => setRxNotes(e.target.value)}
                          rows={4}
                          placeholder="Enter prescription details, medications, dosage..."
                          className="mt-1 resize-none"
                          data-ocid="rx-notes-input"
                        />
                      </div>
                      <div>
                        <Label>Upload File</Label>
                        <button
                          type="button"
                          className="mt-1 w-full border-2 border-dashed border-input rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-smooth hover:bg-primary/5"
                          data-ocid="rx-file-upload"
                          onClick={() =>
                            toast.info("File picker would open here")
                          }
                        >
                          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                          <p className="text-sm font-medium text-foreground">
                            Click to upload prescription
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF, JPG, PNG up to 10MB
                          </p>
                        </button>
                      </div>
                      <Button
                        className="btn-primary gap-2 w-full sm:w-auto"
                        type="button"
                        onClick={() => {
                          if (!selectedPatient || !rxDate) {
                            toast.error("Please select a patient and date");
                            return;
                          }
                          toast.success("Prescription uploaded successfully");
                          setSelectedPatient("");
                          setRxNotes("");
                          setRxDate("");
                        }}
                        data-ocid="upload-rx-btn"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Prescription
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* PRESCRIPTION HISTORY */}
            {activeTab === "rx-history" && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold font-display text-foreground">
                  Prescription History
                </h2>
                <Card className="card-elevated">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/30">
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Patient
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Date
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              File
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Notes
                            </th>
                            <th className="text-right px-4 py-3 font-semibold text-muted-foreground">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {PRESCRIPTION_HISTORY.map((rx) => (
                            <tr
                              key={rx.id}
                              className="border-b border-border hover:bg-muted/20 transition-colors"
                              data-ocid="rx-history-row"
                            >
                              <td className="px-4 py-3 font-medium text-foreground">
                                {rx.patient}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {formatDate(rx.date)}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground text-xs">
                                {rx.fileName}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground text-xs max-w-[180px] truncate">
                                {rx.notes}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs"
                                    type="button"
                                    data-ocid="download-rx-btn"
                                  >
                                    Download
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="text-xs"
                                    type="button"
                                    data-ocid="delete-rx-btn"
                                    onClick={() =>
                                      toast.success("Prescription deleted")
                                    }
                                  >
                                    Delete
                                  </Button>
                                </div>
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

            {/* PROFILE */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold font-display text-foreground">
                  My Profile
                </h2>
                <Card className="card-elevated">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                      <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold flex-shrink-0">
                        {doctorInfo?.name.split(" ")[1]?.[0] ?? "D"}
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-lg font-display">
                          {user?.name ?? doctorInfo?.name ?? "Doctor"}
                        </p>
                        <Badge className="bg-primary/10 text-primary mt-1">
                          Doctor
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="dr-qualifications">
                          Qualifications
                        </Label>
                        <Input
                          id="dr-qualifications"
                          value={profileForm.qualifications}
                          onChange={(e) =>
                            setProfileForm((f) => ({
                              ...f,
                              qualifications: e.target.value,
                            }))
                          }
                          className="mt-1"
                          data-ocid="dr-qualifications-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dr-experience">Experience</Label>
                        <Input
                          id="dr-experience"
                          value={profileForm.experience}
                          onChange={(e) =>
                            setProfileForm((f) => ({
                              ...f,
                              experience: e.target.value,
                            }))
                          }
                          className="mt-1"
                          data-ocid="dr-experience-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dr-hospital">Hospital</Label>
                        <Input
                          id="dr-hospital"
                          value={profileForm.hospital}
                          onChange={(e) =>
                            setProfileForm((f) => ({
                              ...f,
                              hospital: e.target.value,
                            }))
                          }
                          className="mt-1"
                          data-ocid="dr-hospital-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dr-hours">Available Hours</Label>
                        <Input
                          id="dr-hours"
                          value={profileForm.availableHours}
                          onChange={(e) =>
                            setProfileForm((f) => ({
                              ...f,
                              availableHours: e.target.value,
                            }))
                          }
                          className="mt-1"
                          data-ocid="dr-hours-input"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="dr-bio">Bio</Label>
                        <Textarea
                          id="dr-bio"
                          value={profileForm.bio}
                          onChange={(e) =>
                            setProfileForm((f) => ({
                              ...f,
                              bio: e.target.value,
                            }))
                          }
                          rows={3}
                          className="mt-1 resize-none"
                          data-ocid="dr-bio-input"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6 pt-5 border-t border-border">
                      <Button
                        className="btn-primary"
                        type="button"
                        onClick={() => toast.success("Profile updated!")}
                        data-ocid="save-dr-profile-btn"
                      >
                        Save Changes
                      </Button>
                      <Button variant="outline" type="button">
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-elevated">
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      Account
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm">Role</span>
                        <Badge className="bg-primary/10 text-primary">
                          Doctor
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm">Speciality</span>
                        <span className="text-sm text-muted-foreground">
                          {doctorInfo?.speciality ?? "Doctor"}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-4 gap-1.5"
                      type="button"
                      onClick={logout}
                      data-ocid="dr-signout-btn"
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
