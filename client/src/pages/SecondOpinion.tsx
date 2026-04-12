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
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  Star,
  Stethoscope,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

const HOW_IT_WORKS = [
  {
    step: "1",
    icon: Upload,
    title: "Submit Your Reports",
    desc: "Upload your existing diagnosis, pathology reports, scan reports, and current treatment details.",
  },
  {
    step: "2",
    icon: Stethoscope,
    title: "Specialist Review",
    desc: "A senior specialist reviews your case within 48 hours and discusses with a multidisciplinary panel if needed.",
  },
  {
    step: "3",
    icon: MessageSquare,
    title: "Expert Recommendation",
    desc: "Receive a detailed written opinion with treatment recommendations, alternative options, and next steps.",
  },
];

const REASONS = [
  "Complex diagnosis requiring expert confirmation",
  "Multiple treatment options — need clarity on the best path",
  "Rare or unusual gynecological condition",
  "Major surgical procedure has been recommended",
  "Current treatment not showing expected results",
  "Seeking specialist opinion before IVF or high-risk procedure",
];

const EXPERT_DOCTORS = [
  {
    name: "Dr. Anjali Kulkarni",
    spec: "Gynecological Oncology & Minimally Invasive Surgery",
    exp: "22 years",
    cases: "5,000+",
    rating: 4.9,
    available: true,
  },
  {
    name: "Dr. Priya Sharma",
    spec: "Reproductive Medicine & IVF",
    exp: "18 years",
    cases: "3,500+",
    rating: 4.8,
    available: true,
  },
  {
    name: "Dr. Sunita Patil",
    spec: "Maternal-Fetal Medicine & High-Risk Pregnancy",
    exp: "20 years",
    cases: "4,200+",
    rating: 4.9,
    available: false,
  },
  {
    name: "Dr. Meera Joshi",
    spec: "Endocrinology & PCOS Management",
    exp: "15 years",
    cases: "2,800+",
    rating: 4.7,
    available: true,
  },
];

const SPECIALITIES = [
  "Obstetrics & Gynecology",
  "Gynecological Oncology",
  "Reproductive Medicine & IVF",
  "Maternal-Fetal Medicine",
  "Endocrinology / PCOS",
  "Minimally Invasive Surgery",
  "Urogynecology",
  "Menopause Management",
];

export default function SecondOpinionPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      "Second opinion request submitted! Our specialist will contact you within 48 hours.",
    );
  };

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-14 border-b border-border">
        <div className="container mx-auto px-4">
          <Badge variant="secondary" className="mb-3">
            Expert Review
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground max-w-2xl leading-tight mb-4">
            Get a Second Opinion from Senior Specialists
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mb-6">
            When your diagnosis is complex or a major procedure is suggested — a
            second expert opinion can change everything. Our specialists review
            your case in 48 hours.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "48-hour turnaround", icon: Clock },
              { label: "200+ expert specialists", icon: Stethoscope },
              { label: "10,000+ cases reviewed", icon: FileText },
            ].map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-card rounded-full px-3 py-1.5 border border-border shadow-hospital text-sm"
              >
                <Icon className="h-3.5 w-3.5 text-primary" />
                <span className="text-foreground font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold font-display text-foreground mb-6 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="text-center relative">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {step}
                  </span>
                </div>
                <h3 className="font-bold font-display text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
                {step !== "3" && (
                  <ArrowRight className="hidden md:block absolute right-0 top-6 h-5 w-5 text-muted-foreground -translate-y-1/2 translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
          {/* Why Seek Second Opinion */}
          <div>
            <h2 className="text-xl font-bold font-display text-foreground mb-4">
              When Should You Seek a Second Opinion?
            </h2>
            <div className="space-y-3 mb-8">
              {REASONS.map((r) => (
                <div key={r} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{r}</p>
                </div>
              ))}
            </div>

            <div className="bg-muted/30 rounded-xl p-5 border border-border">
              <h3 className="font-bold font-display text-foreground mb-3">
                Cost of Second Opinion
              </h3>
              <div className="space-y-2">
                {[
                  {
                    type: "Written Opinion (Basic)",
                    price: "₹500",
                    tat: "48 hours",
                  },
                  {
                    type: "Written Opinion + Video Consult",
                    price: "₹1,200",
                    tat: "24 hours",
                  },
                  {
                    type: "Multidisciplinary Panel Review",
                    price: "₹3,000",
                    tat: "72 hours",
                  },
                ].map(({ type, price, tat }) => (
                  <div
                    key={type}
                    className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0"
                  >
                    <span className="text-foreground">{type}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {tat}
                      </span>
                      <span className="font-bold text-primary">{price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Request Form */}
          <Card className="card-elevated">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold font-display text-foreground mb-5">
                Request Second Opinion
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="so-name">Patient Name</Label>
                    <Input
                      id="so-name"
                      placeholder="Full name"
                      className="mt-1"
                      data-ocid="so-name-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="so-age">Age</Label>
                    <Input
                      id="so-age"
                      type="number"
                      placeholder="Years"
                      className="mt-1"
                      min="1"
                      max="120"
                      data-ocid="so-age-input"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="so-email">Email Address</Label>
                  <Input
                    id="so-email"
                    type="email"
                    placeholder="you@email.com"
                    className="mt-1"
                    data-ocid="so-email-input"
                  />
                </div>
                <div>
                  <Label htmlFor="so-diagnosis">Current Diagnosis</Label>
                  <Input
                    id="so-diagnosis"
                    placeholder="e.g., Endometriosis Stage III"
                    className="mt-1"
                    data-ocid="so-diagnosis-input"
                  />
                </div>
                <div>
                  <Label htmlFor="so-treatment">Current Treatment Plan</Label>
                  <Input
                    id="so-treatment"
                    placeholder="e.g., Laparoscopic surgery recommended"
                    className="mt-1"
                    data-ocid="so-treatment-input"
                  />
                </div>
                <div>
                  <Label htmlFor="so-hospital">Current Hospital / Clinic</Label>
                  <Input
                    id="so-hospital"
                    placeholder="Where were you diagnosed?"
                    className="mt-1"
                    data-ocid="so-hospital-input"
                  />
                </div>
                <div>
                  <Label htmlFor="so-speciality">Specialist Needed</Label>
                  <Select>
                    <SelectTrigger
                      id="so-speciality"
                      className="mt-1"
                      data-ocid="so-speciality-select"
                    >
                      <SelectValue placeholder="Select speciality" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPECIALITIES.map((s) => (
                        <SelectItem
                          key={s}
                          value={s.toLowerCase().replace(/\s/g, "-")}
                        >
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="so-reports">Upload Reports</Label>
                  <Input
                    id="so-reports"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    className="mt-1"
                    data-ocid="so-reports-input"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, JPG, PNG · Max 10MB per file · Multiple allowed
                  </p>
                </div>
                <div>
                  <Label htmlFor="so-concerns">Your Specific Concerns</Label>
                  <Textarea
                    id="so-concerns"
                    placeholder="What specific questions do you want our specialist to address?"
                    className="mt-1 min-h-[90px]"
                    data-ocid="so-concerns-input"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full btn-accent font-semibold"
                  data-ocid="so-submit-btn"
                >
                  Submit for Review
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Expert Doctors */}
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground mb-6">
            Our Second Opinion Experts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {EXPERT_DOCTORS.map((doc) => (
              <Card
                key={doc.name}
                className="card-elevated hover:shadow-hospital-lg transition-smooth"
              >
                <CardContent className="p-5 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 mx-auto mb-4 text-xl font-bold text-primary">
                    {doc.name
                      .split(" ")
                      .slice(1)
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h3 className="font-bold text-foreground text-sm mb-0.5">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {doc.spec}
                  </p>
                  <div className="flex justify-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3 w-3 ${s <= Math.floor(doc.rating) ? "text-yellow-500 fill-yellow-500" : "text-muted"}`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                      {doc.rating}
                    </span>
                  </div>
                  <div className="flex justify-center gap-3 text-xs text-muted-foreground mb-3">
                    <span>{doc.exp} exp</span>
                    <span>·</span>
                    <span>{doc.cases} cases</span>
                  </div>
                  <Badge
                    className={`text-[10px] ${doc.available ? "bg-green-100 text-green-700 border-green-200" : "bg-muted text-muted-foreground border-border"}`}
                  >
                    {doc.available ? "Available" : "Fully Booked"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
