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
import { ChevronDown, Clock, Mail, MapPin, Phone, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const BRANCHES = [
  {
    name: "GyneCare Hospital — Pune Main",
    address: "Survey No. 341, Model Colony, Shivajinagar",
    city: "Pune, Maharashtra 411016",
    phone: "+91 20 2567 8900",
    email: "pune@gynecarehosp.in",
    hours: "OPD: 8AM–8PM · Emergency: 24×7",
  },
  {
    name: "GyneCare Hospital — Mumbai",
    address: "B-12, Turner Road, Bandra West",
    city: "Mumbai, Maharashtra 400050",
    phone: "+91 22 4567 8900",
    email: "mumbai@gynecarehosp.in",
    hours: "OPD: 8AM–8PM · Emergency: 24×7",
  },
  {
    name: "GyneCare Hospital — Nashik",
    address: "Opp. Old CBS, College Road",
    city: "Nashik, Maharashtra 422005",
    phone: "+91 253 2567 890",
    email: "nashik@gynecarehosp.in",
    hours: "OPD: 9AM–7PM · Emergency: 24×7",
  },
];

const FAQS = [
  {
    q: "How do I book an appointment?",
    a: "You can book online via our website, call our helpline (+91 98765 43210), or walk in to any GyneCare branch. Online booking is available 24×7.",
  },
  {
    q: "What documents should I carry for my first visit?",
    a: "Please carry a government-issued photo ID, any existing medical reports, prescriptions, and your insurance card if applicable.",
  },
  {
    q: "Does GyneCare accept health insurance?",
    a: "Yes, we work with 40+ insurance companies including Star Health, ICICI Lombard, Medi Assist, and major government schemes including Ayushman Bharat.",
  },
  {
    q: "How can I access my lab reports online?",
    a: "Log in to the GyneCare patient portal using your registered mobile number. Reports are uploaded within 24 hours of collection.",
  },
  {
    q: "What is the consultation fee for a gynecologist?",
    a: "Consultation fees range from ₹500–₹1,200 depending on the specialist and whether it is a first visit or follow-up. IVF specialist consultations start at ₹1,500.",
  },
  {
    q: "Is there parking available at the hospitals?",
    a: "All three branches have dedicated multi-level parking. Pune and Mumbai offer valet services. Parking is free for the first 2 hours.",
  },
  {
    q: "Can I get a teleconsultation outside business hours?",
    a: "Our teleconsultation service is available Monday–Saturday 8AM–9PM. For emergencies, our 24×7 helpline connects you to an on-call doctor.",
  },
  {
    q: "How long does it take to get a second opinion report?",
    a: "Our specialist second opinion reports are typically ready within 48 hours for standard cases. Complex cases may take up to 72 hours.",
  },
  {
    q: "Is the pregnancy tracker available without logging in?",
    a: "The basic pregnancy calendar is publicly accessible. Detailed week-by-week tracking with personalized data requires login.",
  },
  {
    q: "How do I cancel or reschedule an appointment?",
    a: "Appointments can be cancelled or rescheduled up to 4 hours before the scheduled time through our website, app, or helpline.",
  },
];

const SUBJECTS = [
  "General Inquiry",
  "Appointment Help",
  "Billing & Insurance",
  "Feedback",
  "Complaint",
  "Media / PR",
  "Career",
  "Other",
];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you within 24 hours.");
  };

  const handleFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please provide a star rating");
      return;
    }
    toast.success("Thank you for your feedback!");
    setRating(0);
  };

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-muted/40 py-10 border-b border-border">
        <div className="container mx-auto px-4">
          <Badge variant="secondary" className="mb-3">
            Contact Us
          </Badge>
          <h1 className="text-4xl font-bold font-display text-foreground">
            Help & Contact
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            We're here to help you 24×7. Reach us by phone, email, or visit any
            of our branches.
          </p>
          <div className="mt-5 flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-xl px-4 py-3 w-fit">
            <Phone className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">24×7 Helpline</p>
              <p className="text-lg font-bold text-foreground">
                +91 98765 43210
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Contact form + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <div>
            <h2 className="text-2xl font-bold font-display mb-6">
              Send Us a Message
            </h2>
            <Card className="card-elevated">
              <CardContent className="p-6">
                <form onSubmit={handleContact} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-name">Full Name</Label>
                      <Input
                        id="contact-name"
                        placeholder="Your full name"
                        className="mt-1"
                        data-ocid="contact-name-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-phone">Phone</Label>
                      <Input
                        id="contact-phone"
                        placeholder="9876543210"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="you@example.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-subject">Subject</Label>
                    <Select>
                      <SelectTrigger
                        id="contact-subject"
                        className="mt-1"
                        data-ocid="contact-subject-select"
                      >
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map((s) => (
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
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea
                      id="contact-message"
                      placeholder="How can we help you?"
                      className="mt-1 min-h-[120px]"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full btn-primary"
                    data-ocid="contact-submit-btn"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-bold font-display mb-6">
              Contact Information
            </h2>
            <div className="space-y-4">
              {[
                {
                  icon: Phone,
                  label: "Helpline (24×7)",
                  value: "+91 98765 43210",
                  sub: "Emergency: 1800-200-1234 (Toll Free)",
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: "info@gynecarehosp.in",
                  sub: "Response within 24 hours",
                },
                {
                  icon: MapPin,
                  label: "Head Office",
                  value: "Model Colony, Shivajinagar, Pune — 411016",
                  sub: "Maharashtra, India",
                },
                {
                  icon: Clock,
                  label: "OPD Hours",
                  value: "Monday–Saturday: 8AM–8PM",
                  sub: "Emergency department: 24×7 all days",
                },
              ].map(({ icon: Icon, label, value, sub }) => (
                <Card key={label} className="card-elevated">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="font-semibold text-sm text-foreground">
                        {value}
                      </p>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Branch Locations */}
        <h2 className="text-2xl font-bold font-display mb-6">Our Locations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {BRANCHES.map((branch) => (
            <Card
              key={branch.name}
              className="card-elevated hover:shadow-hospital-lg transition-smooth"
            >
              <CardContent className="p-5">
                <div className="flex h-10 w-10 rounded-xl bg-primary/10 items-center justify-center mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold font-display text-foreground mb-2">
                  {branch.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-1">
                  {branch.address}
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  {branch.city}
                </p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {branch.phone}
                  </p>
                  <p className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {branch.email}
                  </p>
                  <p className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {branch.hours}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 gap-1"
                  onClick={() => toast.info("Map opens in Google Maps")}
                >
                  <MapPin className="h-3.5 w-3.5" />
                  Get Directions
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <h2 className="text-2xl font-bold font-display mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2 mb-16" data-ocid="faq-section">
          {FAQS.map((faq, idx) => (
            <Card key={faq.q} className="card-elevated overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-smooth"
                data-ocid="faq-item"
                aria-expanded={openFaq === idx}
              >
                <span className="font-semibold text-sm text-foreground pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${openFaq === idx ? "rotate-180" : ""}`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Card className="card-elevated">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold font-display mb-5">
                Share Your Feedback
              </h2>
              <form onSubmit={handleFeedback} className="space-y-4">
                <div>
                  <Label>Overall Experience</Label>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="transition-smooth"
                        aria-label={`${star} star${star > 1 ? "s" : ""}`}
                        data-ocid="feedback-star"
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${(hoverRating || rating) >= star ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="feedback-name">Your Name (Optional)</Label>
                  <Input
                    id="feedback-name"
                    placeholder="Anonymous if blank"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="feedback-dept">Department Visited</Label>
                  <Input
                    id="feedback-dept"
                    placeholder="e.g., OPD, Emergency, IVF"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="feedback-message">Your Feedback</Label>
                  <Textarea
                    id="feedback-message"
                    placeholder="Tell us about your experience..."
                    className="mt-1 min-h-[100px]"
                    data-ocid="feedback-textarea"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full btn-accent"
                  data-ocid="feedback-submit-btn"
                >
                  Submit Feedback
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-5">
            <Card className="card-elevated bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-bold font-display mb-4">
                  Emergency Contacts
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      label: "24×7 Emergency (All Branches)",
                      number: "1800-200-1234",
                    },
                    { label: "Blood Bank Emergency", number: "1800-200-5678" },
                    {
                      label: "ICU / NICU Helpline",
                      number: "+91 20 6789 0101",
                    },
                    {
                      label: "Ambulance Services",
                      number: "102 / +91 20 6789 0000",
                    },
                  ].map(({ label, number }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between border-b border-border pb-2 last:border-0"
                    >
                      <span className="text-sm text-muted-foreground">
                        {label}
                      </span>
                      <a
                        href={`tel:${number}`}
                        className="font-bold text-primary text-sm hover:underline"
                      >
                        {number}
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="card-elevated">
              <CardContent className="p-5">
                <h3 className="font-bold font-display mb-3">Social Media</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Follow GyneCare for health tips, doctor Q&As, and hospital
                  updates.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Facebook",
                    "Instagram",
                    "Twitter/X",
                    "YouTube",
                    "LinkedIn",
                  ].map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 bg-muted rounded-lg text-xs font-medium border border-border cursor-pointer hover:bg-primary/10 transition-smooth"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
