import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  BookOpen,
  Building2,
  Clock,
  Eye,
  Heart,
  Shield,
  Stethoscope,
  Target,
  Users,
} from "lucide-react";

const MILESTONES = [
  {
    year: "1998",
    event: "GyneCare Hospitals founded in Pune with 50-bed capacity",
  },
  { year: "2001", event: "Launched Maharashtra's first dedicated IVF unit" },
  {
    year: "2004",
    event:
      "Received NABH accreditation — first gynecology hospital in Western India",
  },
  {
    year: "2008",
    event: "Expanded to Mumbai and Nashik; crossed 10,000 annual deliveries",
  },
  {
    year: "2012",
    event: "Inaugurated the Centre of Excellence in Maternal-Fetal Medicine",
  },
  { year: "2016", event: "Achieved JCI International Accreditation" },
  {
    year: "2019",
    event: "Launched 24×7 teleconsultation services across all branches",
  },
  {
    year: "2024",
    event: "50,000+ successful deliveries and 5,000+ IVF babies milestone",
  },
];

const LEADERSHIP = [
  {
    name: "Dr. Ramesh Kulkarni",
    title: "Founder & Chairman",
    exp: "35 years",
    specialty: "Obstetrics & Gynecology",
    initials: "RK",
    quote:
      "Our mission is simple — every woman deserves compassionate, expert care.",
  },
  {
    name: "Dr. Seema Joshi",
    title: "Medical Director",
    exp: "28 years",
    specialty: "Reproductive Medicine & IVF",
    initials: "SJ",
    quote:
      "Innovation in gynecology must always be guided by empathy and ethics.",
  },
  {
    name: "Dr. Vijay Patil",
    title: "Director, Clinical Operations",
    exp: "22 years",
    specialty: "Gynecological Oncology",
    initials: "VP",
    quote:
      "We set standards that inspire the next generation of women's health specialists.",
  },
];

const ACCREDITATIONS = [
  {
    name: "NABH",
    full: "National Accreditation Board for Hospitals",
    year: "2004",
    icon: Shield,
  },
  {
    name: "JCI",
    full: "Joint Commission International",
    year: "2016",
    icon: Award,
  },
  {
    name: "ISO 9001:2015",
    full: "Quality Management System Certified",
    year: "2010",
    icon: BookOpen,
  },
  {
    name: "NABL",
    full: "National Accreditation Board for Laboratories",
    year: "2008",
    icon: Stethoscope,
  },
];

const AWARDS = [
  {
    title: "Best Gynecology Hospital — Maharashtra",
    org: "Indian Medical Association",
    year: "2024",
  },
  {
    title: "Excellence in Women's Healthcare",
    org: "Times Healthcare Awards",
    year: "2023",
  },
  {
    title: "Best IVF Center — Western India",
    org: "FOGSI Annual Awards",
    year: "2022",
  },
  {
    title: "Patient Safety Excellence Award",
    org: "Quality Council of India",
    year: "2023",
  },
];

const VALUES = [
  {
    icon: Heart,
    title: "Compassion",
    desc: "We treat every patient with empathy, dignity, and respect.",
  },
  {
    icon: Shield,
    title: "Integrity",
    desc: "Ethical practice, transparent communication, no surprises.",
  },
  {
    icon: Users,
    title: "Teamwork",
    desc: "Multidisciplinary collaboration for the best patient outcomes.",
  },
  {
    icon: BookOpen,
    title: "Excellence",
    desc: "Continuous learning, research, and clinical innovation.",
  },
];

const STATS = [
  { icon: Building2, label: "Hospitals", value: "12+" },
  { icon: Award, label: "Years of Care", value: "26+" },
  { icon: Users, label: "Specialist Doctors", value: "200+" },
  { icon: Heart, label: "Patients/Year", value: "50,000+" },
  { icon: Stethoscope, label: "Deliveries", value: "1L+" },
  { icon: Clock, label: "IVF Babies", value: "5,000+" },
];

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <img
          src="/assets/generated/hero-gynecology.dim_1400x600.jpg"
          alt="GyneCare Hospital"
          className="absolute inset-0 h-full w-full object-cover opacity-10"
        />
        <div className="relative bg-muted/40 border-b border-border py-14">
          <div className="container mx-auto px-4">
            <Badge variant="secondary" className="mb-4">
              About Us
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground max-w-2xl leading-tight mb-4">
              Two Decades of Compassionate Women's Healthcare
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              GyneCare Hospital Network — Maharashtra's leading gynecology and
              women's health provider. NABH accredited since 2004. JCI certified
              since 2016.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {STATS.map(({ icon: Icon, label, value }) => (
            <Card key={label} className="card-elevated text-center">
              <CardContent className="p-4">
                <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold font-display text-foreground">
                  {value}
                </p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold font-display mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              GyneCare was founded in 1998 by Dr. Ramesh Kulkarni with a simple
              but powerful vision — to create a hospital where every woman feels
              heard, respected, and cared for with the highest standards of
              medical excellence.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Starting with a 50-bed hospital in Pune, we grew into a
              12-hospital network across Maharashtra, earning international
              accreditations and pioneering several first-in-region medical
              services including the state's first dedicated IVF unit in 2001.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-display mb-4">
              Key Milestones
            </h2>
            <div className="space-y-3">
              {MILESTONES.map((m) => (
                <div key={m.year} className="flex items-start gap-4">
                  <div className="flex h-10 w-16 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                    <span className="text-xs font-bold text-primary">
                      {m.year}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground pt-2">
                    {m.event}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vision Mission Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="card-elevated border-l-4 border-l-primary">
            <CardContent className="p-6">
              <Eye className="h-8 w-8 text-primary mb-3" />
              <h2 className="text-xl font-bold font-display mb-3">
                Our Vision
              </h2>
              <p className="text-muted-foreground">
                To be India's most trusted women's healthcare provider —
                delivering compassionate, comprehensive, and advanced
                gynecological care to every woman, irrespective of geography or
                economic status.
              </p>
            </CardContent>
          </Card>
          <Card className="card-elevated border-l-4 border-l-accent">
            <CardContent className="p-6">
              <Target className="h-8 w-8 text-accent mb-3" />
              <h2 className="text-xl font-bold font-display mb-3">
                Our Mission
              </h2>
              <p className="text-muted-foreground">
                To empower women through healthcare excellence — combining
                cutting-edge medical technology, skilled specialists, and
                genuine compassion to improve the quality of life for every
                patient we serve.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <h2 className="text-2xl font-bold font-display mb-6">
          Our Core Values
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <Card
              key={title}
              className="card-elevated hover:shadow-hospital-lg transition-smooth"
            >
              <CardContent className="p-5 text-center">
                <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-primary/10 mb-4">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold font-display text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Leadership */}
        <h2 className="text-2xl font-bold font-display mb-6">Our Leadership</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {LEADERSHIP.map((leader) => (
            <Card key={leader.name} className="card-elevated">
              <CardContent className="p-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {leader.initials}
                  </span>
                </div>
                <div className="text-center mb-4">
                  <h3 className="font-bold font-display text-foreground">
                    {leader.name}
                  </h3>
                  <p className="text-sm text-primary font-medium">
                    {leader.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {leader.specialty} · {leader.exp} exp
                  </p>
                </div>
                <p className="text-sm text-muted-foreground italic text-center border-t border-border pt-4">
                  "{leader.quote}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Accreditations */}
        <h2 className="text-2xl font-bold font-display mb-6">
          Accreditations & Certifications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {ACCREDITATIONS.map(({ name, full, year, icon: Icon }) => (
            <Card key={name} className="card-elevated text-center">
              <CardContent className="p-5">
                <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-primary/10 mb-3">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <p className="text-xl font-bold font-display text-primary">
                  {name}
                </p>
                <p className="text-xs text-muted-foreground mb-1">{full}</p>
                <Badge variant="secondary" className="text-[10px]">
                  Since {year}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Awards */}
        <h2 className="text-2xl font-bold font-display mb-6">
          Awards & Recognition
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AWARDS.map((award) => (
            <Card key={award.title} className="card-elevated">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 flex-shrink-0">
                  <Award className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">
                    {award.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{award.org}</p>
                  <Badge variant="secondary" className="mt-1 text-[10px]">
                    {award.year}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
