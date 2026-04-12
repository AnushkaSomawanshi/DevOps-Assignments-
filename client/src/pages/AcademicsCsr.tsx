import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  ExternalLink,
  FlaskConical,
  GraduationCap,
  Heart,
  IndianRupee,
  Users,
} from "lucide-react";
import { toast } from "sonner";

const FELLOWSHIPS = [
  {
    name: "Fellowship in Gynecological Oncology",
    duration: "2 years",
    seats: 4,
    eligibility: "MS/MD OBG",
  },
  {
    name: "Fellowship in Reproductive Medicine & IVF",
    duration: "1 year",
    seats: 6,
    eligibility: "MS/MD OBG",
  },
  {
    name: "Fellowship in Fetal Medicine",
    duration: "1 year",
    seats: 3,
    eligibility: "MS/MD OBG",
  },
  {
    name: "DNB Obstetrics & Gynaecology",
    duration: "3 years",
    seats: 8,
    eligibility: "MBBS + Internship",
  },
  {
    name: "Post-Doctoral Fellowship, Minimal Access Surgery",
    duration: "1 year",
    seats: 4,
    eligibility: "MS/MD Surgery or OBG",
  },
];

const NURSING_PROGRAMS = [
  {
    name: "B.Sc. Nursing (Affiliated)",
    duration: "4 years",
    intake: "30 seats/year",
  },
  {
    name: "Post-Basic B.Sc. Nursing",
    duration: "2 years",
    intake: "20 seats/year",
  },
  {
    name: "Critical Care Nursing Certificate",
    duration: "6 months",
    intake: "15 seats/batch",
  },
];

const PAPERS = [
  {
    title:
      "Laparoscopic management of endometriosis — 5-year outcomes at GyneCare",
    journal: "Journal of Minimally Invasive Gynecology",
    year: "2025",
    authors: "Kulkarni A, Sharma P, Patil S",
  },
  {
    title:
      "Cumulative live birth rate after frozen embryo transfer: a retrospective cohort study",
    journal: "Human Reproduction",
    year: "2024",
    authors: "Sharma P, Joshi M, Desai R",
  },
  {
    title: "Prevalence of PCOS in urban Maharashtra — a cross-sectional study",
    journal: "Indian Journal of Endocrinology",
    year: "2024",
    authors: "Kulkarni A, Pawar N",
  },
  {
    title:
      "Maternal outcomes in high-risk pregnancies managed with a multidisciplinary protocol",
    journal: "BJOG: International Journal of Obstetrics",
    year: "2023",
    authors: "Patil S, Sharma P, Kulkarni A",
  },
];

const CSR_INITIATIVES = [
  {
    title: "Free Cervical Cancer Screening Camps",
    impact: "14,000+ women screened",
    icon: Heart,
    desc: "Monthly free Pap smear and HPV screening camps in rural Maharashtra.",
  },
  {
    title: "Maternal Health Awareness Program",
    impact: "200+ villages covered",
    icon: Users,
    desc: "Door-to-door maternal health education in Pune, Nashik, and Ahmednagar districts.",
  },
  {
    title: "Subsidized IVF for Underprivileged",
    impact: "500+ families helped",
    icon: Heart,
    desc: "70% subsidy on IVF treatments for families with annual income below ₹3 lakhs.",
  },
  {
    title: "School Health Education",
    impact: "80+ schools reached",
    icon: GraduationCap,
    desc: "Menstrual hygiene and reproductive health education programs in government schools.",
  },
  {
    title: "Rural Health Outreach Clinics",
    impact: "Weekly clinics in 30 villages",
    icon: Users,
    desc: "Mobile OBG clinics providing consultations and medicines in underserved areas.",
  },
  {
    title: "Blood Donation Drives",
    impact: "2,000+ units collected/year",
    icon: Heart,
    desc: "Quarterly blood donation camps at hospitals and corporate offices.",
  },
];

const RESEARCH_PROJECTS = [
  {
    title: "Long-term Outcomes of Minimally Invasive Hysterectomy",
    status: "Ongoing",
    pi: "Dr. Anjali Kulkarni",
    collab: "AIIMS Delhi",
  },
  {
    title: "AI-assisted Ultrasound Screening for Ovarian Cancer",
    status: "Ongoing",
    pi: "Dr. Sunita Patil",
    collab: "IIT Bombay",
  },
  {
    title: "Gut Microbiome in Endometriosis — Phase II Clinical Trial",
    status: "Recruiting",
    pi: "Dr. Priya Sharma",
    collab: "Tata Institute",
  },
  {
    title: "Predictors of IVF Success in Women with PCOS",
    status: "Analysis",
    pi: "Dr. Meera Joshi",
    collab: "GyneCare Research Cell",
  },
];

const DONATION_PURPOSES = [
  "Free Cervical Cancer Screening",
  "Subsidized IVF Program",
  "Maternal & Neonatal Care Fund",
  "Medical Education Scholarship",
  "Rural Health Outreach Program",
  "Blood Bank Support",
  "General CSR Fund",
];

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000];

export default function AcademicsCsrPage() {
  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      "Thank you for your generous donation! A receipt will be emailed to you.",
    );
  };

  return (
    <Layout>
      {/* Header */}
      <div className="bg-muted/40 py-10 border-b border-border">
        <div className="container mx-auto px-4">
          <Badge variant="secondary" className="mb-3">
            Knowledge &amp; Community
          </Badge>
          <h1 className="text-4xl font-bold font-display text-foreground">
            Academics, CSR &amp; Research
          </h1>
          <p className="text-muted-foreground mt-2">
            Advancing gynecology through education, research, and community care
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <Tabs defaultValue="academics" className="w-full">
          <TabsList
            className="flex flex-wrap h-auto gap-1 mb-8 bg-muted p-1 rounded-xl w-full sm:w-auto"
            data-ocid="acad-tabs"
          >
            <TabsTrigger
              value="academics"
              className="gap-1.5"
              data-ocid="tab-academics"
            >
              <GraduationCap className="h-4 w-4" />
              Academics
            </TabsTrigger>
            <TabsTrigger value="csr" className="gap-1.5" data-ocid="tab-csr">
              <Heart className="h-4 w-4" />
              CSR
            </TabsTrigger>
            <TabsTrigger
              value="research"
              className="gap-1.5"
              data-ocid="tab-research"
            >
              <FlaskConical className="h-4 w-4" />
              Research
            </TabsTrigger>
            <TabsTrigger
              value="donate"
              className="gap-1.5"
              data-ocid="tab-donate"
            >
              <IndianRupee className="h-4 w-4" />
              Donate
            </TabsTrigger>
          </TabsList>

          {/* ── Academics ── */}
          <TabsContent value="academics" className="space-y-10">
            <section>
              <h2 className="text-xl font-bold font-display mb-5 flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                Fellowship &amp; Residency Programs
              </h2>
              <div className="space-y-3">
                {FELLOWSHIPS.map((f) => (
                  <Card key={f.name} className="card-elevated">
                    <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-sm">
                          {f.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Duration: {f.duration} · Eligibility: {f.eligibility}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Badge variant="secondary" className="text-xs">
                          {f.seats} seats
                        </Badge>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() =>
                            toast.info(
                              "Applications open in July. Email academics@gynecarehosp.in",
                            )
                          }
                        >
                          Apply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold font-display mb-5 flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Nursing Training Programs
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {NURSING_PROGRAMS.map((p) => (
                  <Card key={p.name} className="card-elevated">
                    <CardContent className="p-5">
                      <h3 className="font-bold text-sm text-foreground mb-2">
                        {p.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Duration: {p.duration}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Intake: {p.intake}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold font-display mb-5 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                Published Research Papers
              </h2>
              <div className="space-y-3">
                {PAPERS.map((paper) => (
                  <Card key={paper.title} className="card-elevated">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-foreground leading-snug mb-1">
                            {paper.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {paper.journal} · {paper.year}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {paper.authors}
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="flex-shrink-0 h-7 w-7"
                          aria-label="View paper"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>

          {/* ── CSR ── */}
          <TabsContent value="csr">
            <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
              <Heart className="h-6 w-6 text-accent" />
              Community Social Responsibility Initiatives
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {CSR_INITIATIVES.map(({ title, impact, icon: Icon, desc }) => (
                <Card
                  key={title}
                  className="card-elevated hover:shadow-hospital-lg transition-smooth"
                >
                  <CardContent className="p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 mb-4">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{desc}</p>
                    <Badge className="bg-primary/10 text-primary border-0 text-xs">
                      {impact}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-10 bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl border border-border p-8 text-center">
              <Users className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold font-display text-foreground mb-2">
                Partner With Us
              </h3>
              <p className="text-muted-foreground mb-5 max-w-lg mx-auto">
                Corporates, NGOs, and individuals — join GyneCare's CSR mission
                for women's health in Maharashtra.
              </p>
              <Button
                type="button"
                className="btn-accent"
                onClick={() =>
                  toast.info("Partnership inquiries: csr@gynecarehosp.in")
                }
              >
                Become a CSR Partner
              </Button>
            </div>
          </TabsContent>

          {/* ── Research ── */}
          <TabsContent value="research">
            <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
              <FlaskConical className="h-6 w-6 text-primary" />
              Active Research Projects
            </h2>
            <div className="space-y-4">
              {RESEARCH_PROJECTS.map((r) => (
                <Card key={r.title} className="card-elevated">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                      <FlaskConical className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <h3 className="font-bold text-foreground text-sm leading-snug">
                          {r.title}
                        </h3>
                        <Badge
                          className={`flex-shrink-0 text-[11px] ${
                            r.status === "Ongoing"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : r.status === "Recruiting"
                                ? "bg-primary/15 text-primary border-primary/20"
                                : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {r.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        PI: {r.pi}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Collaboration: {r.collab}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="card-elevated mt-8 bg-muted/30">
              <CardContent className="p-6">
                <h3 className="font-bold font-display text-foreground mb-2">
                  Research Collaboration
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Interested in research collaboration or funding our studies?
                  Contact our Research Director.
                </p>
                <p className="text-sm font-semibold text-foreground">
                  research@gynecarehosp.in
                </p>
                <p className="text-xs text-muted-foreground">
                  Dr. Anjali Kulkarni — Research Director, GyneCare Hospital
                  Network
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Donate ── */}
          <TabsContent value="donate">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <h2 className="text-xl font-bold font-display text-foreground mb-3">
                  Support Women's Health
                </h2>
                <p className="text-muted-foreground mb-6">
                  Your donation directly funds free healthcare services for
                  underprivileged women across Maharashtra. All donations are
                  eligible for tax exemption under Section 80G of the Income Tax
                  Act.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { amount: "₹500", impact: "Funds 1 Pap smear screening" },
                    {
                      amount: "₹1,000",
                      impact: "Provides prenatal vitamins for 1 month",
                    },
                    {
                      amount: "₹5,000",
                      impact: "Covers OPD consultation for 5 women",
                    },
                    {
                      amount: "₹10,000",
                      impact: "Supports 1 IVF subsidy contribution",
                    },
                  ].map(({ amount, impact }) => (
                    <div
                      key={amount}
                      className="bg-card border border-border rounded-xl p-4"
                    >
                      <p className="text-xl font-bold text-primary font-display">
                        {amount}
                      </p>
                      <p className="text-sm text-muted-foreground">{impact}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-muted/40 rounded-xl p-4 border border-border">
                  <p className="text-sm font-semibold text-foreground mb-1">
                    80G Tax Exemption
                  </p>
                  <p className="text-xs text-muted-foreground">
                    GyneCare Foundation is a registered NGO under Section 12A.
                    All donations are eligible for 50% tax deduction. Receipt
                    issued within 24 hours.
                  </p>
                </div>
              </div>

              <Card className="card-elevated">
                <CardContent className="p-6">
                  <h3 className="font-bold font-display text-foreground mb-5">
                    Make a Donation
                  </h3>
                  <form onSubmit={handleDonate} className="space-y-4">
                    <div>
                      <Label htmlFor="donate-name">Donor Name</Label>
                      <Input
                        id="donate-name"
                        placeholder="Your full name"
                        className="mt-1"
                        data-ocid="donate-name-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="donate-email">Email Address</Label>
                      <Input
                        id="donate-email"
                        type="email"
                        placeholder="you@email.com"
                        className="mt-1"
                        data-ocid="donate-email-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="donate-phone">Phone Number</Label>
                      <Input
                        id="donate-phone"
                        placeholder="9876543210"
                        className="mt-1"
                        data-ocid="donate-phone-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="donate-purpose">Donation Purpose</Label>
                      <Select>
                        <SelectTrigger
                          id="donate-purpose"
                          className="mt-1"
                          data-ocid="donate-purpose-select"
                        >
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          {DONATION_PURPOSES.map((p) => (
                            <SelectItem
                              key={p}
                              value={p.toLowerCase().replace(/\s/g, "-")}
                            >
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Amount (₹)</Label>
                      <div className="flex flex-wrap gap-2 mt-1 mb-2">
                        {PRESET_AMOUNTS.map((amt) => (
                          <button
                            type="button"
                            key={amt}
                            className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm font-medium hover:border-primary hover:text-primary transition-smooth"
                            data-ocid={`donate-preset-${amt}`}
                          >
                            ₹{amt.toLocaleString("en-IN")}
                          </button>
                        ))}
                      </div>
                      <Input
                        placeholder="Or enter custom amount"
                        type="number"
                        min="100"
                        data-ocid="donate-amount-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="donate-message">Message (Optional)</Label>
                      <Textarea
                        id="donate-message"
                        placeholder="In memory of / In honor of..."
                        className="mt-1"
                        rows={2}
                        data-ocid="donate-message-input"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full btn-accent font-semibold"
                      data-ocid="donate-submit-btn"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Donate Now
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
