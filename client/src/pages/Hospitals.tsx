import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useHospitals } from "@/hooks/useCatalog";
import type { Hospital } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  BedDouble,
  Building2,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  Phone,
  Search,
  Shield,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const EXTRA_HOSPITALS = [
  {
    id: "h4",
    name: "GyneCare Hospital — Aurangabad",
    address: "Cidco Colony, N-2 Area",
    city: "Aurangabad",
    state: "Maharashtra",
    pincode: "431003",
    phone: "+91 98765 43213",
    email: "aurangabad@gynecarehosp.in",
    imageUrl: "/assets/generated/hero-gynecology.dim_1400x600.jpg",
    facilities: ["OT Suite", "NICU", "IVF Lab", "24x7 Emergency", "Radiology"],
    bedCapacity: 150,
    doctorCount: 25,
    emergencyAvailable: true,
    coordinates: { lat: 19.8762, lng: 75.3433 },
  },
  {
    id: "h5",
    name: "GyneCare Hospital — Nagpur",
    address: "Sitabuldi, Central Avenue",
    city: "Nagpur",
    state: "Maharashtra",
    pincode: "440012",
    phone: "+91 98765 43214",
    email: "nagpur@gynecarehosp.in",
    imageUrl: "/assets/generated/hero-gynecology.dim_1400x600.jpg",
    facilities: ["ICU", "Pathology", "Blood Bank", "Pharmacy"],
    bedCapacity: 200,
    doctorCount: 35,
    emergencyAvailable: true,
    coordinates: { lat: 21.1458, lng: 79.0882 },
  },
  {
    id: "h6",
    name: "GyneCare Hospital — Kolhapur",
    address: "Rajarampuri, 7th Lane",
    city: "Kolhapur",
    state: "Maharashtra",
    pincode: "416008",
    phone: "+91 98765 43215",
    email: "kolhapur@gynecarehosp.in",
    imageUrl: "/assets/generated/hero-gynecology.dim_1400x600.jpg",
    facilities: ["OPD", "Laparoscopy Suite", "Pathology", "Radiology"],
    bedCapacity: 100,
    doctorCount: 15,
    emergencyAvailable: false,
    coordinates: { lat: 16.705, lng: 74.2433 },
  },
];

export default function HospitalsPage() {
  const { data: hospitals = [] } = useHospitals();
  const EXTENDED_HOSPITALS = [...hospitals, ...EXTRA_HOSPITALS];
  const CITIES = [...new Set(EXTENDED_HOSPITALS.map((h) => h.city))];
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null,
  );

  const filtered = EXTENDED_HOSPITALS.filter((h) => {
    const matchCity = !selectedCity || h.city === selectedCity;
    const matchSearch =
      !search ||
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase());
    return matchCity && matchSearch;
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-14 border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-3">
              <Building2 className="h-3 w-3 mr-1" />
              Our Network
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-3">
              Our Hospital Branches
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Comprehensive women's healthcare across Maharashtra —
              state-of-the-art facilities and dedicated specialists.
            </p>
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-primary" />
                {EXTENDED_HOSPITALS.length}+ Hospitals
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-primary" />
                200+ Specialists
              </span>
              <span className="flex items-center gap-1.5">
                <BedDouble className="h-4 w-4 text-primary" />
                2000+ Beds
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-primary" />
                NABH Accredited
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-card border-b border-border py-5 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search hospital name or city..."
                className="w-full h-10 rounded-lg border border-input bg-background pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-ocid="hospital-search"
              />
            </div>
            <select
              className="h-10 rounded-lg border border-input bg-background px-4 text-sm"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              data-ocid="hospital-city-filter"
            >
              <option value="">All Cities</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {(search || selectedCity) && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => {
                  setSearch("");
                  setSelectedCity("");
                }}
              >
                <X className="h-4 w-4" /> Clear
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {filtered.length} hospital{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </section>

      {/* Hospital Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered.map((hospital, i) => (
            <motion.div
              key={hospital.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Card className="card-elevated hover:shadow-hospital-lg transition-smooth overflow-hidden group h-full flex flex-col">
                <div className="h-52 overflow-hidden bg-muted relative">
                  <img
                    src={hospital.imageUrl}
                    alt={hospital.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-smooth duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <div className="absolute top-3 left-3">
                    {hospital.emergencyAvailable && (
                      <Badge className="bg-accent text-accent-foreground text-xs">
                        24×7 Emergency
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h2 className="text-white font-bold font-display text-lg leading-tight line-clamp-2">
                      {hospital.name}
                    </h2>
                  </div>
                </div>

                <CardContent className="p-5 flex flex-col flex-1">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        {hospital.address}, {hospital.city} — {hospital.pincode}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 text-primary" />
                      <a
                        href={`tel:${hospital.phone}`}
                        className="hover:text-primary transition-colors"
                      >
                        {hospital.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>{hospital.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>OPD: Mon–Sat, 8AM–8PM</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <BedDouble className="h-5 w-5 text-primary mx-auto mb-1" />
                      <div className="font-bold text-sm">
                        {hospital.bedCapacity}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Beds
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <Users className="h-5 w-5 text-primary mx-auto mb-1" />
                      <div className="font-bold text-sm">
                        {hospital.doctorCount}+
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Doctors
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-foreground mb-2">
                      Key Facilities:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {hospital.facilities.slice(0, 5).map((f) => (
                        <Badge
                          key={f}
                          variant="secondary"
                          className="text-[10px] flex items-center gap-1"
                        >
                          <CheckCircle className="h-2.5 w-2.5 text-primary" />{" "}
                          {f}
                        </Badge>
                      ))}
                      {hospital.facilities.length > 5 && (
                        <Badge variant="secondary" className="text-[10px]">
                          +{hospital.facilities.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-sm"
                      onClick={() => setSelectedHospital(hospital as Hospital)}
                      data-ocid="hospital-view-details-btn"
                    >
                      View Details
                    </Button>
                    <Link to="/book-appointment" className="flex-1">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm">
                        Book Appointment
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Hospital Detail Modal */}
      {selectedHospital && (
        <dialog
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 m-0 max-w-none w-full h-full"
          onClick={() => setSelectedHospital(null)}
          onKeyDown={(e) => e.key === "Escape" && setSelectedHospital(null)}
          open
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56 overflow-hidden rounded-t-2xl bg-muted">
              <img
                src={selectedHospital.imageUrl}
                alt={selectedHospital.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute top-3 right-3 bg-foreground/40 hover:bg-foreground/60 text-white rounded-full"
                onClick={() => setSelectedHospital(null)}
                data-ocid="hospital-modal-close"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-4 left-4 right-4">
                {selectedHospital.emergencyAvailable && (
                  <Badge className="bg-accent text-accent-foreground mb-2 text-xs">
                    24×7 Emergency
                  </Badge>
                )}
                <h2 className="text-white font-bold font-display text-2xl leading-tight">
                  {selectedHospital.name}
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/5 rounded-xl p-4 text-center">
                  <BedDouble className="h-6 w-6 text-primary mx-auto mb-1" />
                  <div className="font-bold text-xl">
                    {selectedHospital.bedCapacity}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Beds
                  </div>
                </div>
                <div className="bg-accent/5 rounded-xl p-4 text-center">
                  <Users className="h-6 w-6 text-accent mx-auto mb-1" />
                  <div className="font-bold text-xl">
                    {selectedHospital.doctorCount}+
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Specialists
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> Location & Contact
                </h3>
                <div className="bg-muted/40 rounded-xl p-4 space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    {selectedHospital.address}, {selectedHospital.city},{" "}
                    {selectedHospital.state} — {selectedHospital.pincode}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    {selectedHospital.phone}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    {selectedHospital.email}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  All Facilities
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedHospital.facilities.map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {selectedHospital.emergencyAvailable && (
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                  <p className="text-sm font-semibold text-accent mb-1">
                    Emergency Contact
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    +91 98765 43200
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Available 24×7 for medical emergencies
                  </p>
                </div>
              )}

              <div className="bg-muted/40 rounded-xl h-48 flex items-center justify-center text-muted-foreground text-sm">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Map placeholder — {selectedHospital.city}, Maharashtra
              </div>

              <div className="flex gap-3">
                <Link to="/book-appointment" className="flex-1">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Book Appointment
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedHospital(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </dialog>
      )}
    </Layout>
  );
}
