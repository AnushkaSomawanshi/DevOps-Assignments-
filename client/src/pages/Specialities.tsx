import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Baby,
  CheckCircle,
  ChevronRight,
  Heart,
  Microscope,
  ShieldCheck,
  Star,
  Stethoscope,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

const SPECIALITIES = [
  {
    id: "gynaecology",
    icon: Heart,
    name: "Obstetrics & Gynecology",
    tagline: "Comprehensive care from conception to menopause",
    description:
      "Our flagship department offers holistic women's reproductive health services — from routine annual exams to complex high-risk deliveries and minimally invasive surgeries.",
    services: [
      "Normal & C-Section Delivery",
      "High-Risk Pregnancy Management",
      "Laparoscopic Surgery",
      "Hysterectomy (Robotic/Laparoscopic)",
      "PCOS Diagnosis & Management",
      "Endometriosis Treatment",
      "Menopause Management",
      "Urinary Incontinence Care",
    ],
    doctorCount: 45,
    highlight: true,
    color: "accent",
  },
  {
    id: "ivf",
    icon: Baby,
    name: "IVF & Fertility",
    tagline: "Advanced assisted reproduction for intended parents",
    description:
      "Maharashtra's leading fertility center — offering personalized IVF protocols, donor programs, and fertility preservation with a 62% success rate.",
    services: [
      "IVF / ICSI Treatment",
      "Intrauterine Insemination (IUI)",
      "Egg Freezing (Oocyte Cryopreservation)",
      "Donor Egg & Sperm Programs",
      "Preimplantation Genetic Testing",
      "Surrogacy Consultation",
    ],
    doctorCount: 18,
    highlight: true,
    color: "accent",
  },
  {
    id: "oncology",
    icon: Microscope,
    name: "Gynecologic Oncology",
    tagline: "Expert cancer care — detection, surgery, treatment",
    description:
      "Our oncology specialists bring cutting-edge robotic surgical techniques to gynecologic cancer treatment, focusing on organ preservation and quality of life.",
    services: [
      "Cervical Cancer Treatment",
      "Ovarian Cancer Surgery",
      "Uterine / Endometrial Cancer",
      "Robotic Minimally Invasive Surgery",
      "Chemotherapy & Immunotherapy",
      "Colposcopy & Biopsy",
    ],
    doctorCount: 12,
    highlight: false,
    color: "primary",
  },
  {
    id: "maternal",
    icon: Stethoscope,
    name: "Maternal-Fetal Medicine",
    tagline: "High-risk pregnancy specialists",
    description:
      "Our perinatology unit is equipped for the most challenging pregnancies, with in-house NICU support and advanced fetal monitoring technology.",
    services: [
      "Prenatal Diagnosis & Genetic Counseling",
      "Twin & Multiple Pregnancy",
      "Preterm Birth Prevention",
      "NICU Level III Care",
      "Fetal Echocardiography",
      "Intrauterine Growth Restriction",
    ],
    doctorCount: 10,
    highlight: false,
    color: "primary",
  },
  {
    id: "preventive",
    icon: ShieldCheck,
    name: "Preventive Women's Health",
    tagline: "Early detection & wellness packages",
    description:
      "Proactive health screenings, cancer detection programs, and curated wellness packages designed specifically for women at every life stage.",
    services: [
      "Cervical Cancer Screening (Pap + HPV)",
      "Breast Health & Mammography",
      "Bone Density Assessment",
      "Full Hormonal Profile",
      "Diabetes & Thyroid Screening",
      "Customized Wellness Packages",
    ],
    doctorCount: 8,
    highlight: false,
    color: "primary",
  },
  {
    id: "menopause",
    icon: Activity,
    name: "Menopause Clinic",
    tagline: "Specialized hormonal & lifestyle care",
    description:
      "Our dedicated menopause clinic provides evidence-based hormonal therapy, bone health management, and psychological support through the menopausal transition.",
    services: [
      "Hormone Replacement Therapy (HRT)",
      "Osteoporosis Prevention & Treatment",
      "Hot Flashes & Mood Management",
      "Genitourinary Syndrome Treatment",
      "Libido & Sexual Health",
      "Lifestyle & Nutrition Counseling",
    ],
    doctorCount: 6,
    highlight: false,
    color: "primary",
  },
];

export default function SpecialitiesPage() {
  return (
    <Layout>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16 border-b border-border overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-3">
              Women's Health Excellence
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-4">
              Our Medical Specialities
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mb-6">
              Comprehensive gynecology and women's health services — backed by
              Maharashtra's most experienced team of specialists,
              NABH-accredited and committed to excellence.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/book-appointment">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-semibold">
                  Book a Consultation <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/find-doctor">
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2"
                >
                  Find a Specialist <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gynecology Featured Section */}
      <section className="py-14 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl border border-accent/20 overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8 md:p-10">
                <Badge className="bg-accent/15 text-accent border-accent/30 mb-4">
                  <Star className="h-3 w-3 mr-1 fill-current" /> Featured
                  Speciality
                </Badge>
                <h2 className="text-3xl font-bold font-display text-foreground mb-3">
                  Obstetrics & Gynecology
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Our Obstetrics & Gynecology department is the cornerstone of
                  GyneCare. With over 25 years of clinical excellence, our team
                  of 45+ specialists manages over 3,000 deliveries annually —
                  from routine pregnancies to the most complex high-risk cases.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    "Prenatal Care",
                    "Postnatal Support",
                    "IVF Support",
                    "Fertility Consultation",
                    "PCOS Management",
                    "Laparoscopic Surgery",
                    "Hysterectomy",
                    "Menopause Care",
                  ].map((s) => (
                    <div
                      key={s}
                      className="flex items-center gap-2 text-sm text-foreground"
                    >
                      <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Link to="/book-appointment">
                    <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                      Book Consultation
                    </Button>
                  </Link>
                  <Link to="/find-doctor">
                    <Button
                      variant="outline"
                      className="border-accent text-accent hover:bg-accent/10"
                    >
                      Find Gynecologist
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="bg-gradient-to-br from-accent/15 to-primary/10 p-8 md:p-10 flex flex-col justify-center">
                <h3 className="font-semibold text-foreground mb-4">
                  Department Highlights
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "3,000+", label: "Annual Deliveries" },
                    { value: "45+", label: "Specialists" },
                    { value: "25+", label: "Years Experience" },
                    { value: "98%", label: "Patient Satisfaction" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-card/60 rounded-xl p-4 text-center"
                    >
                      <div className="text-2xl font-bold font-display text-primary mb-1">
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* All Specialities Grid */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge variant="secondary" className="mb-3">
              All Departments
            </Badge>
            <h2 className="text-3xl font-bold font-display text-foreground mb-2">
              Complete Speciality List
            </h2>
            <p className="text-muted-foreground">
              Expert care across all areas of women's health
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPECIALITIES.map((spec, i) => (
              <motion.div
                key={spec.id}
                id={spec.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Card
                  className={`card-elevated hover:shadow-hospital-lg transition-smooth group h-full flex flex-col ${spec.highlight ? "ring-2 ring-accent ring-offset-1" : ""}`}
                >
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-xl mb-4 transition-smooth ${spec.highlight ? "bg-accent/15 text-accent group-hover:bg-accent group-hover:text-accent-foreground" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"}`}
                    >
                      <spec.icon className="h-7 w-7" />
                    </div>

                    {spec.highlight && (
                      <Badge className="bg-accent/15 text-accent border-accent/30 mb-2 text-xs w-fit">
                        <Star className="h-2.5 w-2.5 mr-1" /> Featured
                      </Badge>
                    )}

                    <h3 className="font-bold text-foreground font-display text-xl mb-1">
                      {spec.name}
                    </h3>
                    <p className="text-xs text-primary font-medium mb-3">
                      {spec.tagline}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {spec.description}
                    </p>

                    <ul className="space-y-1.5 mb-5 flex-1">
                      {spec.services.slice(0, 4).map((s) => (
                        <li
                          key={s}
                          className="flex items-center gap-2 text-sm text-foreground"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                      {spec.services.length > 4 && (
                        <li className="text-xs text-primary font-medium pl-3.5">
                          +{spec.services.length - 4} more services
                        </li>
                      )}
                    </ul>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4 pt-3 border-t border-border">
                      <Users className="h-3 w-3 text-primary" />
                      <span>{spec.doctorCount} Specialists available</span>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <Link to="/find-doctor" className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full text-xs gap-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          Find Doctor
                        </Button>
                      </Link>
                      <Link to="/book-appointment" className="flex-1">
                        <Button className="w-full text-xs bg-primary hover:bg-primary/90 gap-1">
                          Book <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold font-display text-primary-foreground mb-3">
              Not Sure Which Speciality?
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Our patient coordinators can help you choose the right specialist
              and department for your needs.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/find-doctor">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8">
                  Find a Specialist
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 px-8"
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
