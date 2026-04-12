import { Layout } from "@/components/layout/Layout";
import { BlogCard } from "@/components/ui/BlogCard";
import { DoctorCard } from "@/components/ui/DoctorCard";
import { PackageCard } from "@/components/ui/PackageCard";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useBlogs, useHealthPackages, useHospitals } from "@/hooks/useCatalog";
import { useTopDoctors } from "@/hooks/useDoctors";
import type { Testimonial } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  Baby,
  BedDouble,
  Building2,
  ChevronRight,
  Heart,
  MapPin,
  Microscope,
  Phone,
  PlayCircle,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

const STATS = [
  {
    icon: Building2,
    label: "Hospital Branches",
    value: "12+",
    color: "text-primary",
  },
  {
    icon: Award,
    label: "Years of Excellence",
    value: "20+",
    color: "text-accent",
  },
  {
    icon: Users,
    label: "Specialist Doctors",
    value: "200+",
    color: "text-primary",
  },
  {
    icon: BedDouble,
    label: "Bed Capacity",
    value: "1500+",
    color: "text-accent",
  },
];

const SPECIALITIES = [
  {
    icon: Heart,
    label: "Obstetrics & Gynecology",
    href: "/specialities#gynaecology",
    highlight: true,
  },
  {
    icon: Baby,
    label: "IVF & Fertility",
    href: "/specialities#ivf",
    highlight: true,
  },
  {
    icon: Stethoscope,
    label: "Maternal-Fetal Medicine",
    href: "/specialities#maternal",
    highlight: false,
  },
  {
    icon: Microscope,
    label: "Gynecologic Oncology",
    href: "/specialities#oncology",
    highlight: false,
  },
  {
    icon: ShieldCheck,
    label: "Preventive Health",
    href: "/specialities#preventive",
    highlight: false,
  },
  {
    icon: Baby,
    label: "Neonatology (NICU)",
    href: "/specialities#nicu",
    highlight: false,
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    patientName: "Sneha Marathe",
    patientLocation: "Pune, Maharashtra",
    quote:
      "Dr. Sharma at GyneCare made my high-risk pregnancy feel manageable. The team's compassion and expertise gave me confidence throughout my journey. My baby was born healthy!",
    rating: 5,
    treatment: "High-Risk Pregnancy Care",
    date: "2026-03-01",
  },
  {
    id: "t2",
    patientName: "Prachi Kulkarni",
    patientLocation: "Mumbai, Maharashtra",
    quote:
      "After years of struggling with infertility, Dr. Anjali's IVF program gave us the miracle we dreamed of. The entire team was empathetic and professional at every step.",
    rating: 5,
    treatment: "IVF Treatment",
    date: "2026-02-15",
  },
  {
    id: "t3",
    patientName: "Ritu Desai",
    patientLocation: "Nashik, Maharashtra",
    quote:
      "GyneCare's early cancer detection program saved my life. Dr. Sunita's expertise in oncology is unmatched. I am forever grateful for the care I received.",
    rating: 5,
    treatment: "Gynecologic Oncology",
    date: "2026-01-20",
  },
];

const QUICK_ACTIONS = [
  {
    label: "Find Doctor",
    href: "/find-doctor",
    icon: Users,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Book Appointment",
    href: "/book-appointment",
    icon: ArrowRight,
    color: "bg-accent/10 text-accent",
  },
  {
    label: "Health Checkup",
    href: "/health-packages",
    icon: ShieldCheck,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Teleconsultation",
    href: "/teleconsultation",
    icon: Phone,
    color: "bg-accent/10 text-accent",
  },
  {
    label: "Lab Reports",
    href: "/labs",
    icon: Microscope,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Blood Bank",
    href: "/blood-availability",
    icon: Heart,
    color: "bg-accent/10 text-accent",
  },
];

export default function HomePage() {
  const { data: doctors = [] } = useTopDoctors(4);
  const { data: hospitals = [] } = useHospitals();
  const { data: packages = [] } = useHealthPackages();
  const { data: blogs = [] } = useBlogs();

  return (
    <Layout>
      {/* ── Hero Section ────────────────────────────────── */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/assets/generated/hero-gynecology.dim_1400x600.jpg"
            alt="Compassionate gynecology care"
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-accent/15 text-accent border-accent/30 mb-6 text-sm px-4 py-1.5">
                <Heart className="h-3.5 w-3.5 mr-1.5 fill-current" />
                NABH Accredited Women's Healthcare
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-foreground leading-tight mb-4">
                Compassionate{" "}
                <span className="text-primary">Gynecology Care</span>
                <br />
                for Women's Wellness
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
                Empowering women through comprehensive healthcare at GyneCare.
                From prenatal care to advanced fertility treatments — your
                health is our mission.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/book-appointment" data-ocid="hero-book-btn">
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2 shadow-hospital-lg px-8"
                  >
                    <ArrowRight className="h-5 w-5" />
                    Book an Appointment
                  </Button>
                </Link>
                <Link to="/specialities" data-ocid="hero-specialities-btn">
                  <Button
                    size="lg"
                    variant="outline"
                    className="font-semibold gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Explore Specialities
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Quick Actions ────────────────────────────────── */}
      <section className="bg-primary py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {QUICK_ACTIONS.map((action, i) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link to={action.href} data-ocid={`quick-action-${i}`}>
                  <div className="flex flex-col items-center gap-2 bg-card/10 hover:bg-card/20 rounded-xl p-3 text-center transition-smooth cursor-pointer group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card/20 group-hover:scale-110 transition-smooth">
                      <action.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-xs font-semibold text-primary-foreground leading-tight">
                      {action.label}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Doctor Search ────────────────────────────────── */}
      <section className="bg-muted/30 py-10">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-2xl shadow-hospital-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold font-display text-foreground mb-6 text-center">
              Find Your Specialist
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label
                  htmlFor="home-search-location"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block"
                >
                  Location
                </label>
                <select
                  id="home-search-location"
                  className="w-full h-11 rounded-lg border border-input bg-background px-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                  data-ocid="search-location"
                >
                  <option value="">Select City</option>
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.city}>
                      {h.city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="home-search-speciality"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block"
                >
                  Speciality
                </label>
                <select
                  id="home-search-speciality"
                  className="w-full h-11 rounded-lg border border-input bg-background px-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                  data-ocid="search-speciality"
                >
                  <option value="">All Specialities</option>
                  <option>Obstetrics & Gynecology</option>
                  <option>IVF & Fertility</option>
                  <option>Gynecologic Oncology</option>
                  <option>Maternal-Fetal Medicine</option>
                </select>
              </div>
              <div className="flex items-end">
                <Link to="/find-doctor">
                  <Button
                    className="h-11 px-8 bg-primary hover:bg-primary/90 font-semibold w-full md:w-auto"
                    data-ocid="search-doctor-btn"
                  >
                    Search Doctors
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Specialities ────────────────────────────────── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge variant="secondary" className="mb-3">
              Our Specialities
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">
              Gynecology Services
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Curated check-up and treatment bundles for comprehensive women's
              health
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {SPECIALITIES.map((spec, i) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link to={spec.href}>
                  <Card
                    className={`card-elevated hover:shadow-hospital-lg transition-smooth cursor-pointer group text-center ${spec.highlight ? "ring-1 ring-accent" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div
                        className={`flex h-12 w-12 mx-auto items-center justify-center rounded-xl mb-3 transition-smooth ${spec.highlight ? "bg-accent/15 group-hover:bg-accent text-accent group-hover:text-accent-foreground" : "bg-primary/10 group-hover:bg-primary text-primary group-hover:text-primary-foreground"}`}
                      >
                        <spec.icon className="h-6 w-6" />
                      </div>
                      <p className="text-xs font-semibold text-foreground leading-tight">
                        {spec.label}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us (Stats) ────────────────────────── */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display text-primary-foreground mb-3">
              Why Choose GyneCare?
            </h2>
            <p className="text-primary-foreground/70 max-w-xl mx-auto">
              Maharashtra's most trusted network for women's healthcare — backed
              by numbers.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-card/15 mb-4">
                  <stat.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="text-4xl font-bold text-primary-foreground font-display mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/70">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Doctors ────────────────────────────────── */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <Badge variant="secondary" className="mb-3">
                Our Specialists
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
                Our Specialized Gynecologists
              </h2>
              <p className="text-muted-foreground mt-2">
                Consultant Gynecologist & Obstetrician
              </p>
            </div>
            <Link to="/find-doctor" className="hidden md:block">
              <Button
                variant="outline"
                className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                View All Doctors <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doctor, i) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <DoctorCard doctor={doctor} />
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link to="/find-doctor">
              <Button variant="outline" className="border-primary text-primary">
                View All Doctors <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Health Packages ────────────────────────────── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <Badge variant="secondary" className="mb-3">
                Curated Checkups
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
                Health Packages
              </h2>
              <p className="text-muted-foreground mt-2">
                Curated check-up and pre-ment-up bundle
              </p>
            </div>
            <Link to="/health-packages" className="hidden md:block">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2"
              >
                View All Packages <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.slice(0, 3).map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <PackageCard pkg={pkg} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge variant="secondary" className="mb-3">
              Patient Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
              What Our Patients Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, i) => (
              <motion.div
                key={testimonial.id}
                initial={{
                  opacity: 0,
                  x: i === 0 ? -20 : i === 2 ? 20 : 0,
                  y: 20,
                }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <TestimonialCard testimonial={testimonial} variant="featured" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest Blogs ────────────────────────────────── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <Badge variant="secondary" className="mb-3">
                Health Insights
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
                Women's Health Blogs
              </h2>
              <p className="text-muted-foreground mt-2">
                Expert articles by our specialists
              </p>
            </div>
            <Link to="/blogs" className="hidden md:block">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2"
              >
                All Articles <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogs.map((blog, i) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="h-full"
              >
                <BlogCard blog={blog} className="h-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hospitals / Locations ────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge variant="secondary" className="mb-3">
              Our Network
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
              Hospital Locations
            </h2>
            <p className="text-muted-foreground mt-2">
              Find us across Maharashtra
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hospitals.map((hospital, i) => (
              <motion.div
                key={hospital.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="card-elevated hover:shadow-hospital-lg transition-smooth overflow-hidden group">
                  <div className="h-40 overflow-hidden bg-muted relative">
                    <img
                      src={hospital.imageUrl}
                      alt={hospital.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-smooth duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        {hospital.emergencyAvailable
                          ? "24×7 Emergency"
                          : "OPD Only"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-foreground font-display mb-2 line-clamp-1">
                      {hospital.name}
                    </h3>
                    <div className="flex items-start gap-1.5 text-xs text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />
                      <span>
                        {hospital.address}, {hospital.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <Phone className="h-3 w-3 text-primary" />
                      <span>{hospital.phone}</span>
                    </div>
                    <div className="flex gap-3 text-xs text-center">
                      <div className="flex-1 bg-muted/50 rounded-lg p-2">
                        <div className="font-bold text-foreground">
                          {hospital.doctorCount}+
                        </div>
                        <div className="text-muted-foreground">Doctors</div>
                      </div>
                      <div className="flex-1 bg-muted/50 rounded-lg p-2">
                        <div className="font-bold text-foreground">
                          {hospital.bedCapacity}
                        </div>
                        <div className="text-muted-foreground">Beds</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Videos Section ────────────────────────────────── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge variant="secondary" className="mb-3">
              Video Library
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
              Health Awareness Videos
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Understanding PCOS: A Comprehensive Guide",
                duration: "12:45",
                category: "PCOS",
              },
              {
                title: "Your Pregnancy Journey: Week-by-Week Guide",
                duration: "18:30",
                category: "Pregnancy",
              },
              {
                title: "IVF Treatment: What to Expect",
                duration: "15:20",
                category: "Fertility",
              },
            ].map((video, i) => (
              <motion.div
                key={video.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to="/videos">
                  <Card className="card-elevated hover:shadow-hospital-lg transition-smooth group overflow-hidden cursor-pointer">
                    <div className="relative h-44 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <PlayCircle className="h-14 w-14 text-primary opacity-80 group-hover:scale-110 transition-smooth" />
                      <span className="absolute bottom-2 right-2 bg-foreground/70 text-card text-xs px-2 py-0.5 rounded">
                        {video.duration}
                      </span>
                    </div>
                    <CardContent className="p-4">
                      <Badge variant="secondary" className="text-[10px] mb-2">
                        {video.category}
                      </Badge>
                      <p className="font-semibold text-foreground text-sm line-clamp-2">
                        {video.title}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display text-primary-foreground mb-4">
              Your Health Journey Starts Here
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto text-lg">
              Book an appointment with our specialists today and take the first
              step towards better health.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/book-appointment" data-ocid="cta-book-btn">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 shadow-hospital-lg"
                >
                  Book an Appointment
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-8"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
