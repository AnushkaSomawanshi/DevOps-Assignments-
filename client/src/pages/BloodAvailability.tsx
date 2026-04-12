import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  CheckCircle,
  Droplets,
  Heart,
  Phone,
  Users,
} from "lucide-react";
import { toast } from "sonner";

const BLOOD_DATA = [
  {
    group: "O+",
    units: 25,
    status: "available" as const,
    hospital: "Pune Main",
  },
  { group: "O-", units: 4, status: "limited" as const, hospital: "Nashik" },
  {
    group: "A+",
    units: 18,
    status: "available" as const,
    hospital: "Pune Main",
  },
  { group: "A-", units: 2, status: "limited" as const, hospital: "Mumbai" },
  { group: "B+", units: 15, status: "available" as const, hospital: "Mumbai" },
  {
    group: "B-",
    units: 0,
    status: "unavailable" as const,
    hospital: "All Branches",
  },
  { group: "AB+", units: 10, status: "available" as const, hospital: "Nashik" },
  { group: "AB-", units: 1, status: "limited" as const, hospital: "Pune Main" },
];

const STATUS_CONFIG = {
  available: {
    label: "Available",
    bg: "border-green-200 bg-green-50",
    badge: "bg-green-100 text-green-700",
    icon: CheckCircle,
    iconColor: "text-green-600",
  },
  limited: {
    label: "Limited",
    bg: "border-yellow-200 bg-yellow-50",
    badge: "bg-yellow-100 text-yellow-700",
    icon: AlertTriangle,
    iconColor: "text-yellow-600",
  },
  unavailable: {
    label: "Unavailable",
    bg: "border-destructive/20 bg-destructive/5",
    badge: "bg-destructive/10 text-destructive",
    icon: AlertTriangle,
    iconColor: "text-destructive",
  },
};

const DONATION_BENEFITS = [
  {
    icon: Heart,
    title: "Save 3 Lives",
    desc: "One donation can save up to 3 patients in need",
  },
  {
    icon: Users,
    title: "Free Health Check",
    desc: "Donors get a free blood screening at our labs",
  },
  {
    icon: CheckCircle,
    title: "Priority Care",
    desc: "Registered donors receive priority during emergencies",
  },
  {
    icon: Droplets,
    title: "Replenishes Fast",
    desc: "Blood is replaced by your body within 56 days",
  },
];

const BLOOD_GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export default function BloodAvailabilityPage() {
  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      "Blood request submitted! Our blood bank team will contact you within 30 minutes.",
    );
  };

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      "Thank you! We will contact you to schedule your donation appointment.",
    );
  };

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-muted/40 py-10 border-b border-border">
        <div className="container mx-auto px-4">
          <Badge variant="secondary" className="mb-3">
            Blood Bank
          </Badge>
          <h1 className="text-4xl font-bold font-display text-foreground">
            Blood Bank & Availability
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Real-time blood stock across our GyneCare hospital network.
            Emergency requests handled 24×7.
          </p>
          <div className="flex items-center gap-3 mt-4 bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3 w-fit">
            <Phone className="h-5 w-5 text-destructive flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-destructive">
                Blood Bank Emergency
              </p>
              <p className="text-lg font-bold text-foreground">
                1800-200-5678 (Toll Free)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Availability grid */}
        <h2 className="text-2xl font-bold font-display mb-2">
          Current Blood Availability
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Updated every 4 hours. Contact us for the latest stock information.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
          {BLOOD_DATA.map((b) => {
            const cfg = STATUS_CONFIG[b.status];
            const StatusIcon = cfg.icon;
            return (
              <Card key={b.group} className={`card-elevated border ${cfg.bg}`}>
                <CardContent className="p-5 text-center">
                  <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-accent/10 mb-3">
                    <Droplets className="h-7 w-7 text-accent" />
                  </div>
                  <p className="text-3xl font-bold font-display text-foreground mb-0.5">
                    {b.group}
                  </p>
                  {b.status !== "unavailable" && (
                    <p className="text-lg font-semibold text-primary">
                      {b.units} units
                    </p>
                  )}
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold mt-1 ${cfg.badge}`}
                  >
                    <StatusIcon className={`h-3 w-3 ${cfg.iconColor}`} />
                    {cfg.label}
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    {b.hospital}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Request + Donate section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          {/* Emergency Request form */}
          <Card className="card-elevated border-destructive/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-display">
                    Emergency Blood Request
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Response within 30 minutes
                  </p>
                </div>
              </div>
              <form onSubmit={handleRequest} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="blood-patient-name">Patient Name</Label>
                    <Input
                      id="blood-patient-name"
                      placeholder="Full name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="blood-group-needed">
                      Blood Group Needed
                    </Label>
                    <select
                      id="blood-group-needed"
                      className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {BLOOD_GROUPS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="blood-units">Units Required</Label>
                    <Input
                      id="blood-units"
                      type="number"
                      min={1}
                      placeholder="1"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="blood-contact">Contact Number</Label>
                    <Input
                      id="blood-contact"
                      placeholder="9876543210"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="blood-hospital">Hospital / Location</Label>
                  <Input
                    id="blood-hospital"
                    placeholder="Hospital name and city"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="blood-reason">Reason / Diagnosis</Label>
                  <Textarea
                    id="blood-reason"
                    placeholder="Brief medical reason for blood requirement"
                    className="mt-1 min-h-[80px]"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-destructive text-white hover:bg-destructive/90 transition-smooth font-semibold"
                  data-ocid="blood-request-btn"
                >
                  Submit Emergency Request
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Donation */}
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl border border-border p-6">
              <Heart className="h-10 w-10 text-accent mb-4" />
              <h2 className="text-xl font-bold font-display mb-2">
                Donate Blood, Save Lives
              </h2>
              <p className="text-muted-foreground text-sm mb-5">
                Healthy adults between 18–65 years weighing above 50 kg can
                donate every 3 months.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {DONATION_BENEFITS.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex items-start gap-2 bg-card rounded-xl p-3 border border-border"
                  >
                    <Icon className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-xs">{title}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Card className="card-elevated">
              <CardContent className="p-5">
                <h3 className="font-bold font-display mb-4">
                  Register as Donor
                </h3>
                <form onSubmit={handleDonate} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="donor-name">Your Name</Label>
                      <Input
                        id="donor-name"
                        placeholder="Full name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="donor-blood">Your Blood Group</Label>
                      <select
                        id="donor-blood"
                        className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        {BLOOD_GROUPS.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="donor-phone">Phone</Label>
                    <Input
                      id="donor-phone"
                      placeholder="9876543210"
                      className="mt-1"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full btn-accent font-semibold"
                    data-ocid="donor-register-btn"
                  >
                    Register as Donor
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
