import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Briefcase,
  Clock,
  Heart,
  MapPin,
  Stethoscope,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const OPENINGS = [
  {
    id: "j1",
    title: "Senior Consultant Gynecologist",
    dept: "OBG Department",
    location: "Pune",
    type: "Full-time",
    exp: "8+ years",
    salary: "₹20–35 LPA",
    skills: ["MS/MD OBG", "Laparoscopy", "High-risk Pregnancy"],
    urgent: true,
  },
  {
    id: "j2",
    title: "IVF Embryologist",
    dept: "IVF & Fertility Lab",
    location: "Mumbai",
    type: "Full-time",
    exp: "3+ years",
    salary: "₹10–18 LPA",
    skills: ["MSc Embryology", "Semen Analysis", "Cryopreservation"],
    urgent: true,
  },
  {
    id: "j3",
    title: "Staff Nurse (ICU / NICU)",
    dept: "Nursing",
    location: "Nashik",
    type: "Full-time",
    exp: "2+ years",
    salary: "₹4–7 LPA",
    skills: ["B.Sc Nursing", "Critical Care", "Ventilator Management"],
    urgent: false,
  },
  {
    id: "j4",
    title: "Resident Doctor — OBG",
    dept: "OBG Department",
    location: "Pune",
    type: "Full-time",
    exp: "MBBS + Internship",
    salary: "₹6–10 LPA",
    skills: ["MBBS", "Intern Completion", "Emergency Skills"],
    urgent: false,
  },
  {
    id: "j5",
    title: "Medical Lab Technician (MLT)",
    dept: "Diagnostics",
    location: "Pune / Mumbai",
    type: "Full-time",
    exp: "1–3 years",
    salary: "₹3–6 LPA",
    skills: ["DMLT/BMLT", "Hematology", "Microbiology"],
    urgent: false,
  },
  {
    id: "j6",
    title: "Medical Receptionist",
    dept: "Front Office",
    location: "Pune",
    type: "Full-time",
    exp: "1+ year",
    salary: "₹2.5–4 LPA",
    skills: ["Patient Coordination", "Hindi/Marathi/English", "HMS Software"],
    urgent: false,
  },
  {
    id: "j7",
    title: "Hospital IT Support Executive",
    dept: "IT & Systems",
    location: "Pune",
    type: "Full-time",
    exp: "2+ years",
    salary: "₹4–8 LPA",
    skills: ["Networking", "HIS/EMR", "Windows Server"],
    urgent: false,
  },
  {
    id: "j8",
    title: "Hospital Administrator",
    dept: "Operations",
    location: "Mumbai",
    type: "Full-time",
    exp: "5+ years",
    salary: "₹12–20 LPA",
    skills: ["MBA Hospital Mgmt", "NABH Compliance", "HR Management"],
    urgent: false,
  },
];

const VALUES = [
  {
    icon: Heart,
    title: "Patient-Centered Care",
    desc: "Every decision starts with the patient",
  },
  {
    icon: Stethoscope,
    title: "Medical Excellence",
    desc: "Continuous learning and clinical innovation",
  },
  {
    icon: Users,
    title: "Inclusive Workplace",
    desc: "Diversity, respect, and belonging for all",
  },
  {
    icon: Briefcase,
    title: "Growth & Development",
    desc: "CME, fellowships, and leadership tracks",
  },
];

interface ApplyJob {
  id: string;
  title: string;
}

export default function CareerPage() {
  const [applyJob, setApplyJob] = useState<ApplyJob | null>(null);
  const [filter, setFilter] = useState("All");

  const departments = [
    "All",
    "OBG Department",
    "IVF & Fertility Lab",
    "Nursing",
    "Diagnostics",
    "Front Office",
    "IT & Systems",
    "Operations",
  ];
  const filtered =
    filter === "All" ? OPENINGS : OPENINGS.filter((j) => j.dept === filter);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplyJob(null);
    toast.success(
      "Application submitted! Our HR team will contact you within 5 business days.",
    );
  };

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-14 border-b border-border">
        <div className="container mx-auto px-4">
          <Badge variant="secondary" className="mb-3">
            Join Our Team
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground max-w-xl leading-tight mb-4">
            Build Your Career in Women's Healthcare
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mb-6">
            Join Maharashtra's leading gynecology hospital network. Grow with
            passionate clinicians and make a real difference in women's lives.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            {[
              { label: "200+ Doctors", icon: Stethoscope },
              { label: "NABH Accredited", icon: Briefcase },
              { label: "12 Hospitals", icon: MapPin },
            ].map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-card rounded-full px-3 py-1.5 border border-border shadow-hospital"
              >
                <Icon className="h-3.5 w-3.5 text-primary" />
                <span className="text-foreground font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="card-elevated text-center">
              <CardContent className="p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold font-display text-foreground text-sm mb-1">
                  {title}
                </h3>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Job Openings */}
        <div className="mb-10">
          <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
            <h2 className="text-2xl font-bold font-display text-foreground">
              Current Openings
              <span className="text-lg font-normal text-muted-foreground ml-2">
                ({filtered.length} positions)
              </span>
            </h2>
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {departments.map((dept) => (
              <button
                type="button"
                key={dept}
                onClick={() => setFilter(dept)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-smooth border ${
                  filter === dept
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-foreground hover:border-primary/50"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((job) => (
              <Card
                key={job.id}
                className="card-elevated hover:shadow-hospital-lg transition-smooth"
                data-ocid={`job-card-${job.id}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h3 className="font-bold text-foreground">
                          {job.title}
                        </h3>
                        {job.urgent && (
                          <Badge className="bg-accent/15 text-accent border-0 text-[10px]">
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {job.dept}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="btn-primary flex-shrink-0 text-xs"
                      onClick={() =>
                        setApplyJob({ id: job.id, title: job.title })
                      }
                      data-ocid={`apply-btn-${job.id}`}
                    >
                      Apply
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {job.exp}
                    </span>
                    <span className="font-semibold text-primary">
                      {job.salary}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map((s) => (
                      <Badge
                        key={s}
                        variant="secondary"
                        className="text-[10px]"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Open Application */}
        <Card className="card-elevated bg-muted/30">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold font-display text-foreground mb-1">
                Don't see a suitable role?
              </h3>
              <p className="text-sm text-muted-foreground">
                Send us your resume — we'll reach out when a matching position
                opens.
              </p>
            </div>
            <Button
              type="button"
              className="btn-accent flex-shrink-0"
              onClick={() =>
                setApplyJob({ id: "open", title: "Open Application" })
              }
              data-ocid="open-application-btn"
            >
              Submit Open Application
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Apply Modal */}
      <Dialog open={!!applyJob} onOpenChange={() => setApplyJob(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">
              Apply — {applyJob?.title}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleApply} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="app-name">Full Name</Label>
                <Input
                  id="app-name"
                  placeholder="Your name"
                  className="mt-1"
                  data-ocid="app-name-input"
                />
              </div>
              <div>
                <Label htmlFor="app-phone">Phone</Label>
                <Input
                  id="app-phone"
                  placeholder="9876543210"
                  className="mt-1"
                  data-ocid="app-phone-input"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="app-email">Email</Label>
              <Input
                id="app-email"
                type="email"
                placeholder="you@email.com"
                className="mt-1"
                data-ocid="app-email-input"
              />
            </div>
            <div>
              <Label htmlFor="app-position">Position Applied For</Label>
              <Input
                id="app-position"
                defaultValue={applyJob?.title}
                className="mt-1"
                data-ocid="app-position-input"
              />
            </div>
            <div>
              <Label htmlFor="app-cv">Upload CV (PDF/DOC)</Label>
              <Input
                id="app-cv"
                type="file"
                accept=".pdf,.doc,.docx"
                className="mt-1"
                data-ocid="app-cv-input"
              />
            </div>
            <div>
              <Label htmlFor="app-cover">Cover Note</Label>
              <Textarea
                id="app-cover"
                placeholder="Briefly describe your experience and why you want to join GyneCare..."
                className="mt-1 min-h-[100px]"
                data-ocid="app-cover-input"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <Button
                type="submit"
                className="flex-1 btn-primary"
                data-ocid="app-submit-btn"
              >
                Submit Application
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setApplyJob(null)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
