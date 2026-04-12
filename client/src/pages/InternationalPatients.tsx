import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Car,
  CheckCircle,
  FileText,
  Globe,
  Hotel,
  Languages,
  Mail,
  Phone,
  Plane,
  ShieldCheck,
  Star,
} from "lucide-react";
import { toast } from "sonner";

const SERVICES = [
  {
    icon: FileText,
    title: "Medical Visa Assistance",
    desc: "Official invitation letters and help with Indian medical visa documentation.",
  },
  {
    icon: Hotel,
    title: "Accommodation Booking",
    desc: "Curated hotels and recovery guesthouses near our hospitals with transport.",
  },
  {
    icon: Languages,
    title: "Language Interpreter",
    desc: "Trained medical interpreters for Arabic, French, Russian, Swahili, and Bangla.",
  },
  {
    icon: Car,
    title: "Airport Pickup & Transfer",
    desc: "Free airport pickup from Pune, Mumbai, and Nashik airports for registered patients.",
  },
  {
    icon: FileText,
    title: "Medical Records Translation",
    desc: "Certified translation of medical records, prescriptions, and lab reports.",
  },
  {
    icon: ShieldCheck,
    title: "Insurance Coordination",
    desc: "Direct billing with international insurance providers and TPA networks.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Submit Inquiry",
    desc: "Fill in the online form with your medical condition and reports.",
  },
  {
    num: "02",
    title: "Medical Assessment",
    desc: "Our specialist reviews and provides a preliminary consultation online.",
  },
  {
    num: "03",
    title: "Treatment Plan",
    desc: "Receive a detailed treatment plan, cost estimate, and timeline.",
  },
  {
    num: "04",
    title: "Travel & Accommodation",
    desc: "Coordinator helps arrange visa, flights, and accommodation.",
  },
  {
    num: "05",
    title: "Treatment",
    desc: "Arrive and receive world-class gynecological care with dedicated support.",
  },
  {
    num: "06",
    title: "Follow-up Care",
    desc: "Post-treatment teleconsultation and reports shared with your home doctor.",
  },
];

const TESTIMONIALS = [
  {
    name: "Fatima Al-Rashid",
    country: "UAE",
    flag: "🇦🇪",
    treatment: "IVF Treatment",
    quote:
      "After two failed IVF attempts in Dubai, we came to GyneCare. The team was incredibly professional. We are now expecting twins!",
    rating: 5,
  },
  {
    name: "Sarah Okonkwo",
    country: "Nigeria",
    flag: "🇳🇬",
    treatment: "Fibroid Removal",
    quote:
      "The cost was 60% less than what I was quoted in London, and the quality of care was exceptional. Highly recommend GyneCare.",
    rating: 5,
  },
  {
    name: "Yuki Tanaka",
    country: "Japan",
    flag: "🇯🇵",
    treatment: "PCOS Management",
    quote:
      "I was nervous about treatment abroad but Dr. Anjali made me feel at ease. The language support and facilities were excellent.",
    rating: 5,
  },
];

const STAR_RATINGS = [1, 2, 3, 4, 5];

export default function InternationalPatientsPage() {
  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      "Inquiry submitted! Our international desk will contact you within 24 hours.",
    );
  };

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-muted/40 border-b border-border py-14">
        <div className="container mx-auto px-4">
          <Badge variant="secondary" className="mb-4">
            Global Healthcare
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-4 max-w-2xl leading-tight">
            International Patient Services
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mb-8">
            World-class gynecological care for patients travelling to India from
            over 40 countries. NABH accredited. JCI certified.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2.5">
              <Globe className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold">40+ Countries</span>
            </div>
            <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2.5">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold">4.9 / 5 Rating</span>
            </div>
            <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2.5">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold">
                NABH + JCI Certified
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Services */}
        <h2 className="text-2xl font-bold font-display mb-2">
          Services for International Patients
        </h2>
        <p className="text-muted-foreground mb-8">
          Everything coordinated so you can focus entirely on your health.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {SERVICES.map(({ icon: Icon, title, desc }) => (
            <Card
              key={title}
              className="card-elevated hover:shadow-hospital-lg transition-smooth"
            >
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold font-display text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process flow */}
        <div className="bg-muted/30 rounded-2xl border border-border p-8 mb-16">
          <h2 className="text-2xl font-bold font-display mb-8 text-center">
            Your Journey to GyneCare
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STEPS.map((step) => (
              <div key={step.num} className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                  {step.num}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <h2 className="text-2xl font-bold font-display mb-6">
          What International Patients Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="card-elevated">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {STAR_RATINGS.map((s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${s <= t.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-5 italic leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-lg flex-shrink-0">
                    {t.flag}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.country} · {t.treatment}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold font-display mb-6">
              Send Us Your Inquiry
            </h2>
            <Card className="card-elevated">
              <CardContent className="p-6">
                <form onSubmit={handleInquiry} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="intl-name">Full Name</Label>
                      <Input
                        id="intl-name"
                        placeholder="Your full name"
                        className="mt-1"
                        data-ocid="intl-name-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="intl-country">Country</Label>
                      <Input
                        id="intl-country"
                        placeholder="e.g., United Arab Emirates"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="intl-email">Email</Label>
                      <Input
                        id="intl-email"
                        type="email"
                        placeholder="you@example.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="intl-phone">
                        Phone (with country code)
                      </Label>
                      <Input
                        id="intl-phone"
                        placeholder="+971 50 123 4567"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="intl-condition">
                      Medical Issue / Diagnosis
                    </Label>
                    <Input
                      id="intl-condition"
                      placeholder="e.g., PCOS, IVF, fibroid removal"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="intl-details">Additional Details</Label>
                    <Textarea
                      id="intl-details"
                      placeholder="Please describe your condition, any reports you have, and expected timeline..."
                      className="mt-1 min-h-[120px]"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full btn-primary gap-2"
                    data-ocid="intl-inquiry-btn"
                  >
                    Send Inquiry
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="card-elevated bg-primary/5 border-primary/20">
              <CardContent className="p-5">
                <h3 className="font-bold font-display mb-4">
                  International Desk
                </h3>
                {[
                  {
                    icon: Phone,
                    label: "WhatsApp / Phone",
                    value: "+91 98765 11111",
                  },
                  {
                    icon: Mail,
                    label: "Email",
                    value: "international@gynecarehosp.in",
                  },
                  {
                    icon: Globe,
                    label: "Languages",
                    value: "English, Arabic, French, Hindi",
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 mb-4 last:mb-0"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-semibold">{value}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="card-elevated">
              <CardContent className="p-5 text-center">
                <Plane className="h-10 w-10 text-accent mx-auto mb-3" />
                <h3 className="font-bold font-display mb-2">
                  Why Choose India?
                </h3>
                <ul className="text-sm text-muted-foreground text-left space-y-2">
                  {[
                    "Cost 50–80% less than US/UK/UAE",
                    "JCI & NABH accredited hospitals",
                    "World-class IVF success rates",
                    "No wait times for procedures",
                    "Leading gynecology specialists",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
