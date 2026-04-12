import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppointments } from "@/hooks/useAppointments";
import { useAuth } from "@/hooks/useAuth";
import { useBlogs, useHealthPackages, useHospitals, useUsers } from "@/hooks/useCatalog";
import { useDoctors } from "@/hooks/useDoctors";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import {
  Activity,
  Building2,
  Calendar,
  Edit,
  FileText,
  LogOut,
  Package,
  Plus,
  Settings,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type AdminTab =
  | "overview"
  | "doctors"
  | "hospitals"
  | "packages"
  | "blogs"
  | "appointments"
  | "users";

interface ModalState {
  type: "doctor" | "hospital" | "package" | "blog" | null;
  mode: "add" | "edit";
}

// ─── Mock users list ──────────────────────────────────────────────────────────

const MOCK_USERS = [
  {
    id: "u1",
    name: "Prachi Desai",
    email: "prachi@email.com",
    phone: "+91 98765 11111",
    joined: "2026-01-15",
    active: true,
  },
  {
    id: "u2",
    name: "Meera Kulkarni",
    email: "meera@email.com",
    phone: "+91 98765 22222",
    joined: "2026-02-01",
    active: true,
  },
  {
    id: "u3",
    name: "Sunita Patil",
    email: "sunita@email.com",
    phone: "+91 98765 33333",
    joined: "2026-02-20",
    active: true,
  },
  {
    id: "u4",
    name: "Rekha Sharma",
    email: "rekha@email.com",
    phone: "+91 98765 44444",
    joined: "2026-03-05",
    active: false,
  },
  {
    id: "u5",
    name: "Ananya Joshi",
    email: "ananya@email.com",
    phone: "+91 98765 55555",
    joined: "2026-03-15",
    active: true,
  },
];

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "doctors", label: "Manage Doctors", icon: Users },
  { id: "hospitals", label: "Manage Hospitals", icon: Building2 },
  { id: "packages", label: "Manage Packages", icon: Package },
  { id: "blogs", label: "Manage Blogs", icon: FileText },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "users", label: "Users", icon: Users },
];

// ─── Table action buttons ─────────────────────────────────────────────────────

function TableActions({
  onEdit,
  onDelete,
}: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex justify-end gap-2">
      <Button
        size="sm"
        variant="outline"
        className="gap-1 text-xs h-7 px-2"
        type="button"
        onClick={onEdit}
        data-ocid="edit-btn"
      >
        <Edit className="h-3 w-3" /> Edit
      </Button>
      <Button
        size="sm"
        variant="destructive"
        className="gap-1 text-xs h-7 px-2"
        type="button"
        onClick={onDelete}
        data-ocid="delete-btn"
      >
        <Trash2 className="h-3 w-3" /> Delete
      </Button>
    </div>
  );
}

// ─── Simple add/edit modal ────────────────────────────────────────────────────

function SimpleModal({
  title,
  onClose,
  children,
}: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40">
      <div className="bg-card rounded-2xl shadow-hospital-lg w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-bold font-display text-foreground">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { data: appointments = [] } = useAppointments();
  const { data: doctors = [] } = useDoctors();
  const { data: hospitals = [] } = useHospitals();
  const { data: packages = [] } = useHealthPackages();
  const { data: blogs = [] } = useBlogs();
  const { data: users = [] } = useUsers("patient");

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>({ type: null, mode: "add" });
  const [statusFilter, setStatusFilter] = useState("all");

  const totalRevenue = appointments.reduce((sum, a) => sum + a.amount, 0);
  const filteredAppointments =
    statusFilter === "all"
      ? appointments
      : appointments.filter((a) => a.status === statusFilter);

  const openModal = (type: ModalState["type"], mode: "add" | "edit" = "add") =>
    setModal({ type, mode });
  const closeModal = () => setModal({ type: null, mode: "add" });

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
              <Badge className="bg-accent/15 text-accent text-xs">
                Admin Panel
              </Badge>
              <h1 className="text-lg font-bold font-display text-foreground mt-0.5">
                Admin Dashboard
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
            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl mb-5">
              <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm flex-shrink-0">
                {user?.name?.[0] ?? "A"}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">
                  {user?.name ?? "Admin"}
                </p>
                <Badge className="bg-accent/15 text-accent text-[10px]">
                  Administrator
                </Badge>
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
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth text-left ${activeTab === id ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted/50"}`}
                  data-ocid={`admin-tab-${id}`}
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

        {/* Main */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto px-4 py-6 max-w-5xl">
            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold font-display text-foreground">
                  System Overview
                </h2>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      icon: Calendar,
                      label: "Total Appointments",
                      value: appointments.length,
                      color: "text-primary",
                      bg: "bg-primary/10",
                    },
                    {
                      icon: Users,
                      label: "Registered Patients",
                      value: users.length || MOCK_USERS.length,
                      color: "text-accent",
                      bg: "bg-accent/10",
                    },
                    {
                      icon: Activity,
                      label: "Active Doctors",
                      value: doctors.length,
                      color: "text-primary",
                      bg: "bg-primary/10",
                    },
                    {
                      icon: TrendingUp,
                      label: "Total Revenue",
                      value: formatCurrency(totalRevenue),
                      color: "text-accent",
                      bg: "bg-accent/10",
                    },
                  ].map(({ icon: Icon, label, value, color, bg }) => (
                    <Card key={label} className="card-elevated">
                      <CardContent className="p-4 flex flex-col gap-2">
                        <div
                          className={`h-9 w-9 rounded-lg ${bg} flex items-center justify-center`}
                        >
                          <Icon className={`h-4 w-4 ${color}`} />
                        </div>
                        <p className="text-xl font-bold text-foreground">
                          {value}
                        </p>
                        <p className="text-xs text-muted-foreground">{label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Recent appointments */}
                <Card className="card-elevated">
                  <CardContent className="p-5">
                    <h3 className="font-bold font-display mb-4 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Recent Appointments
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 pr-4 font-semibold text-muted-foreground">
                              Patient
                            </th>
                            <th className="text-left py-2 pr-4 font-semibold text-muted-foreground">
                              Doctor
                            </th>
                            <th className="text-left py-2 pr-4 font-semibold text-muted-foreground">
                              Date & Time
                            </th>
                            <th className="text-left py-2 pr-4 font-semibold text-muted-foreground">
                              Status
                            </th>
                            <th className="text-right py-2 font-semibold text-muted-foreground">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments.map((apt) => (
                            <tr
                              key={apt.id}
                              className="border-b border-border hover:bg-muted/20 transition-colors"
                              data-ocid="admin-appointment-row"
                            >
                              <td className="py-3 pr-4 font-medium text-foreground">
                                {apt.patientName}
                              </td>
                              <td className="py-3 pr-4 text-muted-foreground">
                                {apt.doctorName}
                              </td>
                              <td className="py-3 pr-4 text-muted-foreground">
                                {formatDate(apt.date)}{" "}
                                {formatTime(apt.timeSlot)}
                              </td>
                              <td className="py-3 pr-4">
                                <Badge
                                  variant={
                                    apt.status === "confirmed"
                                      ? "default"
                                      : apt.status === "cancelled"
                                        ? "destructive"
                                        : "secondary"
                                  }
                                  className="capitalize text-xs"
                                >
                                  {apt.status}
                                </Badge>
                              </td>
                              <td className="py-3 text-right font-semibold text-foreground">
                                {formatCurrency(apt.amount)}
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

            {/* MANAGE DOCTORS */}
            {activeTab === "doctors" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold font-display text-foreground">
                    Manage Doctors
                  </h2>
                  <Button
                    size="sm"
                    className="btn-primary gap-1.5"
                    type="button"
                    onClick={() => openModal("doctor")}
                    data-ocid="add-doctor-btn"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Doctor
                  </Button>
                </div>
                <Card className="card-elevated">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/30">
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Doctor
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Speciality
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Hospital
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Status
                            </th>
                            <th className="text-right px-4 py-3 font-semibold text-muted-foreground">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {doctors.map((doc) => (
                            <tr
                              key={doc.id}
                              className="border-b border-border hover:bg-muted/20 transition-colors"
                              data-ocid="admin-doctor-row"
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-bold text-primary">
                                      {doc.name.split(" ")[1]?.[0]}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium text-foreground">
                                      {doc.name}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                      {doc.qualification}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground text-xs">
                                {doc.speciality}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground text-xs max-w-[150px] truncate">
                                {doc.hospitalName}
                              </td>
                              <td className="px-4 py-3">
                                <Badge variant="default" className="text-xs">
                                  Active
                                </Badge>
                              </td>
                              <td className="px-4 py-3">
                                <TableActions
                                  onEdit={() => openModal("doctor", "edit")}
                                  onDelete={() =>
                                    toast.success("Doctor removed")
                                  }
                                />
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

            {/* MANAGE HOSPITALS */}
            {activeTab === "hospitals" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold font-display text-foreground">
                    Manage Hospitals
                  </h2>
                  <Button
                    size="sm"
                    className="btn-primary gap-1.5"
                    type="button"
                    onClick={() => openModal("hospital")}
                    data-ocid="add-hospital-btn"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Hospital
                  </Button>
                </div>
                <Card className="card-elevated">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/30">
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Hospital
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              City
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Phone
                            </th>
                            <th className="text-right px-4 py-3 font-semibold text-muted-foreground">
                              Doctors
                            </th>
                            <th className="text-right px-4 py-3 font-semibold text-muted-foreground">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {hospitals.map((h) => (
                            <tr
                              key={h.id}
                              className="border-b border-border hover:bg-muted/20 transition-colors"
                              data-ocid="admin-hospital-row"
                            >
                              <td className="px-4 py-3 font-medium text-foreground">
                                {h.name}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {h.city}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {h.phone}
                              </td>
                              <td className="px-4 py-3 text-right font-semibold text-foreground">
                                {h.doctorCount}
                              </td>
                              <td className="px-4 py-3">
                                <TableActions
                                  onEdit={() => openModal("hospital", "edit")}
                                  onDelete={() =>
                                    toast.success("Hospital removed")
                                  }
                                />
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

            {/* MANAGE PACKAGES */}
            {activeTab === "packages" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold font-display text-foreground">
                    Manage Packages
                  </h2>
                  <Button
                    size="sm"
                    className="btn-primary gap-1.5"
                    type="button"
                    onClick={() => openModal("package")}
                    data-ocid="add-package-btn"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Package
                  </Button>
                </div>
                <Card className="card-elevated">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/30">
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Package
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Category
                            </th>
                            <th className="text-right px-4 py-3 font-semibold text-muted-foreground">
                              Price
                            </th>
                            <th className="text-right px-4 py-3 font-semibold text-muted-foreground">
                              Tests
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Status
                            </th>
                            <th className="text-right px-4 py-3 font-semibold text-muted-foreground">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {packages.map((pkg) => (
                            <tr
                              key={pkg.id}
                              className="border-b border-border hover:bg-muted/20 transition-colors"
                              data-ocid="admin-package-row"
                            >
                              <td className="px-4 py-3 font-medium text-foreground max-w-[200px] truncate">
                                {pkg.name}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {pkg.category}
                              </td>
                              <td className="px-4 py-3 text-right font-semibold text-foreground">
                                {formatCurrency(pkg.price)}
                              </td>
                              <td className="px-4 py-3 text-right text-muted-foreground">
                                {pkg.testCount}
                              </td>
                              <td className="px-4 py-3">
                                <Badge
                                  variant={
                                    pkg.popular ? "default" : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {pkg.popular ? "Active" : "Standard"}
                                </Badge>
                              </td>
                              <td className="px-4 py-3">
                                <TableActions
                                  onEdit={() => openModal("package", "edit")}
                                  onDelete={() =>
                                    toast.success("Package removed")
                                  }
                                />
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

            {/* MANAGE BLOGS */}
            {activeTab === "blogs" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold font-display text-foreground">
                    Manage Blogs
                  </h2>
                  <Button
                    size="sm"
                    className="btn-primary gap-1.5"
                    type="button"
                    onClick={() => openModal("blog")}
                    data-ocid="add-blog-btn"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Blog
                  </Button>
                </div>
                <Card className="card-elevated">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/30">
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Title
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Category
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Author
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Status
                            </th>
                            <th className="text-right px-4 py-3 font-semibold text-muted-foreground">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {blogs.map((blog) => (
                            <tr
                              key={blog.id}
                              className="border-b border-border hover:bg-muted/20 transition-colors"
                              data-ocid="admin-blog-row"
                            >
                              <td className="px-4 py-3 font-medium text-foreground max-w-[220px] truncate">
                                {blog.title}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground text-xs">
                                {blog.category}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground text-xs">
                                {blog.author}
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  type="button"
                                  className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-smooth"
                                  onClick={() =>
                                    toast.success("Blog status toggled")
                                  }
                                  data-ocid="toggle-publish-btn"
                                >
                                  Published
                                </button>
                              </td>
                              <td className="px-4 py-3">
                                <TableActions
                                  onEdit={() => openModal("blog", "edit")}
                                  onDelete={() => toast.success("Blog removed")}
                                />
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

            {/* APPOINTMENTS */}
            {activeTab === "appointments" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h2 className="text-xl font-bold font-display text-foreground">
                    All Appointments
                  </h2>
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="status-filter"
                      className="text-sm text-muted-foreground"
                    >
                      Filter:
                    </label>
                    <select
                      id="status-filter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                      data-ocid="status-filter"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
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
                              Doctor
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Date
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Status
                            </th>
                            <th className="text-right px-4 py-3 font-semibold text-muted-foreground">
                              Amount
                            </th>
                            <th className="text-right px-4 py-3 font-semibold text-muted-foreground">
                              Update
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAppointments.map((apt) => (
                            <tr
                              key={apt.id}
                              className="border-b border-border hover:bg-muted/20 transition-colors"
                              data-ocid="appointments-table-row"
                            >
                              <td className="px-4 py-3 font-medium text-foreground">
                                {apt.patientName}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {apt.doctorName}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {formatDate(apt.date)}{" "}
                                {formatTime(apt.timeSlot)}
                              </td>
                              <td className="px-4 py-3">
                                <Badge
                                  variant={
                                    apt.status === "confirmed"
                                      ? "default"
                                      : apt.status === "cancelled"
                                        ? "destructive"
                                        : "secondary"
                                  }
                                  className="capitalize text-xs"
                                >
                                  {apt.status}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-right font-semibold">
                                {formatCurrency(apt.amount)}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <select
                                  className="h-7 text-xs rounded border border-input bg-background px-2 outline-none focus:ring-1 focus:ring-primary"
                                  defaultValue={apt.status}
                                  onChange={() =>
                                    toast.success("Status updated")
                                  }
                                  data-ocid="status-update-select"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                          {filteredAppointments.length === 0 && (
                            <tr>
                              <td
                                colSpan={6}
                                className="px-4 py-10 text-center text-muted-foreground"
                              >
                                No appointments found for this filter
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* USERS */}
            {activeTab === "users" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold font-display text-foreground">
                    Patient Users
                  </h2>
                  <Badge variant="secondary">
                    {users.length || MOCK_USERS.length} total
                  </Badge>
                </div>
                <Card className="card-elevated">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/30">
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Name
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Email
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Phone
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Joined
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                              Status
                            </th>
                            <th className="text-right px-4 py-3 font-semibold text-muted-foreground">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(users.length
                            ? users.map((u) => ({
                                id: u.id,
                                name: u.name,
                                email: u.email,
                                phone: u.phone,
                                joined: u.createdAt,
                                active: true,
                              }))
                            : MOCK_USERS
                          ).map((u) => (
                            <tr
                              key={u.id}
                              className="border-b border-border hover:bg-muted/20 transition-colors"
                              data-ocid="user-row"
                            >
                              <td className="px-4 py-3 font-medium text-foreground">
                                {u.name}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground text-xs">
                                {u.email}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {u.phone}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {formatDate(u.joined)}
                              </td>
                              <td className="px-4 py-3">
                                <Badge
                                  variant={u.active ? "default" : "destructive"}
                                  className="text-xs"
                                >
                                  {u.active ? "Active" : "Inactive"}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button
                                  size="sm"
                                  variant={u.active ? "destructive" : "outline"}
                                  className="text-xs h-7 px-2"
                                  type="button"
                                  onClick={() =>
                                    toast.success(
                                      u.active
                                        ? "User deactivated"
                                        : "User activated",
                                    )
                                  }
                                  data-ocid="toggle-user-btn"
                                >
                                  {u.active ? "Deactivate" : "Activate"}
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
          </div>
        </main>
      </div>

      {/* Modals */}
      {modal.type === "doctor" && (
        <SimpleModal
          title={`${modal.mode === "add" ? "Add" : "Edit"} Doctor`}
          onClose={closeModal}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="m-dr-name">Name</Label>
                <Input
                  id="m-dr-name"
                  placeholder="Dr. Full Name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="m-dr-qual">Qualifications</Label>
                <Input id="m-dr-qual" placeholder="MD, DGO" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="m-dr-spec">Speciality</Label>
                <Input
                  id="m-dr-spec"
                  placeholder="Obstetrics & Gynecology"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="m-dr-exp">Experience (years)</Label>
                <Input
                  id="m-dr-exp"
                  type="number"
                  placeholder="10"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="m-dr-fee">Consultation Fee (₹)</Label>
                <Input
                  id="m-dr-fee"
                  type="number"
                  placeholder="800"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="m-dr-hosp">Hospital</Label>
                <select
                  id="m-dr-hosp"
                  className="mt-1 w-full h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                className="btn-primary flex-1"
                type="button"
                onClick={() => {
                  toast.success("Doctor saved");
                  closeModal();
                }}
              >
                Save Doctor
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                type="button"
                onClick={closeModal}
              >
                Cancel
              </Button>
            </div>
          </div>
        </SimpleModal>
      )}

      {modal.type === "hospital" && (
        <SimpleModal
          title={`${modal.mode === "add" ? "Add" : "Edit"} Hospital`}
          onClose={closeModal}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label htmlFor="m-h-name">Hospital Name</Label>
                <Input
                  id="m-h-name"
                  placeholder="GyneCare Hospital — City"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="m-h-city">City</Label>
                <Input id="m-h-city" placeholder="Mumbai" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="m-h-phone">Phone</Label>
                <Input
                  id="m-h-phone"
                  placeholder="+91 XXXXX XXXXX"
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="m-h-addr">Address</Label>
                <Input
                  id="m-h-addr"
                  placeholder="Full address"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                className="btn-primary flex-1"
                type="button"
                onClick={() => {
                  toast.success("Hospital saved");
                  closeModal();
                }}
              >
                Save Hospital
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                type="button"
                onClick={closeModal}
              >
                Cancel
              </Button>
            </div>
          </div>
        </SimpleModal>
      )}

      {modal.type === "package" && (
        <SimpleModal
          title={`${modal.mode === "add" ? "Add" : "Edit"} Package`}
          onClose={closeModal}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label htmlFor="m-p-name">Package Name</Label>
                <Input
                  id="m-p-name"
                  placeholder="Wellness Package"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="m-p-price">Price (₹)</Label>
                <Input
                  id="m-p-price"
                  type="number"
                  placeholder="2999"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="m-p-cat">Category</Label>
                <Input id="m-p-cat" placeholder="Preventive" className="mt-1" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="m-p-tests">Tests (comma separated)</Label>
                <Input
                  id="m-p-tests"
                  placeholder="CBC, Thyroid, Pap Smear..."
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                className="btn-primary flex-1"
                type="button"
                onClick={() => {
                  toast.success("Package saved");
                  closeModal();
                }}
              >
                Save Package
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                type="button"
                onClick={closeModal}
              >
                Cancel
              </Button>
            </div>
          </div>
        </SimpleModal>
      )}

      {modal.type === "blog" && (
        <SimpleModal
          title={`${modal.mode === "add" ? "Add" : "Edit"} Blog`}
          onClose={closeModal}
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="m-b-title">Title</Label>
              <Input id="m-b-title" placeholder="Blog title" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="m-b-cat">Category</Label>
                <Input
                  id="m-b-cat"
                  placeholder="Women's Health"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="m-b-author">Author</Label>
                <Input
                  id="m-b-author"
                  placeholder="Dr. Name"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="m-b-img">Image URL</Label>
              <Input id="m-b-img" placeholder="https://..." className="mt-1" />
            </div>
            <div>
              <Label htmlFor="m-b-content">Content</Label>
              <textarea
                id="m-b-content"
                rows={4}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Blog content..."
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                className="btn-primary flex-1"
                type="button"
                onClick={() => {
                  toast.success("Blog saved");
                  closeModal();
                }}
              >
                Save Blog
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                type="button"
                onClick={closeModal}
              >
                Cancel
              </Button>
            </div>
          </div>
        </SimpleModal>
      )}
    </Layout>
  );
}
