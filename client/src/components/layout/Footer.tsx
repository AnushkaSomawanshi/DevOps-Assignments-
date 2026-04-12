import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import {
  Clock,
  Facebook,
  Heart,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";

const QUICK_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Our Hospitals", href: "/hospitals" },
  { label: "Find a Doctor", href: "/find-doctor" },
  { label: "Book Appointment", href: "/book-appointment" },
  { label: "Health Packages", href: "/health-packages" },
  { label: "Teleconsultation", href: "/teleconsultation" },
  { label: "Blood Availability", href: "/blood-availability" },
  { label: "Labs & Reports", href: "/labs" },
];

const DEPARTMENTS = [
  { label: "Obstetrics & Gynecology", href: "/specialities#gynaecology" },
  { label: "IVF & Fertility", href: "/specialities#ivf" },
  { label: "Maternal-Fetal Medicine", href: "/specialities#maternal" },
  { label: "Gynecologic Oncology", href: "/specialities#oncology" },
  { label: "Pediatrics", href: "/specialities#pediatrics" },
  { label: "Neonatology (NICU)", href: "/specialities#nicu" },
  { label: "Laparoscopy", href: "/specialities#laparoscopy" },
  { label: "Menopause Clinic", href: "/specialities#menopause" },
];

const PATIENT_SERVICES = [
  { label: "Patient Dashboard", href: "/dashboard/patient" },
  { label: "International Patients", href: "/international-patients" },
  { label: "Academics & CSR", href: "/academics-csr" },
  { label: "Career Opportunities", href: "/career" },
  { label: "Second Opinion", href: "/second-opinion" },
  { label: "Blogs & Articles", href: "/blogs" },
  { label: "Help & FAQ", href: "/contact" },
  { label: "CSR & Donations", href: "/academics-csr#csr" },
];

const SOCIAL_LINKS = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Twitter, label: "Twitter / X", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;

  return (
    <footer className="bg-card border-t border-border" aria-label="Site footer">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-hospital">
                <span className="text-lg font-bold text-primary-foreground font-display">
                  G
                </span>
              </div>
              <div>
                <div className="text-xl font-bold text-foreground font-display">
                  Gyne<span className="text-accent">Care</span>
                </div>
                <div className="text-[10px] text-muted-foreground tracking-widest uppercase">
                  Hospital Network
                </div>
              </div>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              India's trusted women's healthcare network — delivering
              compassionate, comprehensive gynecological care across Maharashtra
              since 2004. NABH accredited.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  Survey No. 341, Model Colony, Shivajinagar, Pune — 411016,
                  Maharashtra
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span>info@gynecarehosp.in</span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                <span>OPD: Mon–Sat 8:00 AM – 8:00 PM | Emergency: 24×7</span>
              </div>
            </div>

            {/* Social media */}
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-smooth"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 font-display text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 font-display text-sm uppercase tracking-wider">
              Departments
            </h3>
            <ul className="space-y-2.5">
              {DEPARTMENTS.map((dept) => (
                <li key={dept.href}>
                  <Link
                    to={dept.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {dept.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Patient Services */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 font-display text-sm uppercase tracking-wider">
              Services
            </h3>
            <ul className="space-y-2.5">
              {PATIENT_SERVICES.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Accreditation bar */}
      <div className="bg-muted/40 border-t border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">
              NABH Accredited
            </span>
            <Separator orientation="vertical" className="h-4 hidden sm:block" />
            <span>ISO 9001:2015 Certified</span>
            <Separator orientation="vertical" className="h-4 hidden sm:block" />
            <span>Empanelled with CGHS, ECHS</span>
            <Separator orientation="vertical" className="h-4 hidden sm:block" />
            <span>State Health Insurance Approved</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-primary">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/80">
            <p className="flex items-center gap-1">
              © {year} GyneCare Hospital Network. Made with{" "}
              <Heart className="h-3 w-3 text-accent fill-current" /> for women's
              health.
            </p>
            <p>
              Built with{" "}
              <a
                href={utmLink}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary-foreground transition-smooth"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
