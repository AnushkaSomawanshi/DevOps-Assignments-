import { Layout } from "@/components/layout/Layout";
import { DoctorCard } from "@/components/ui/DoctorCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDoctorLocations,
  useDoctors,
  useSpecialities,
} from "@/hooks/useDoctors";
import type { Doctor } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  Award,
  ChevronDown,
  Clock,
  Languages,
  MapPin,
  Search,
  Star,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function FindDoctorPage() {
  const [location, setLocation] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);

  const { data: doctors = [], isLoading } = useDoctors({
    location: location || undefined,
    speciality: speciality || undefined,
  });
  const { data: specialities = [] } = useSpecialities();
  const { data: locations = [] } = useDoctorLocations();

  const filtered = doctors.filter(
    (d) => !search || d.name.toLowerCase().includes(search.toLowerCase()),
  );
  const visible = filtered.slice(0, visibleCount);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-14 border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge variant="secondary" className="mb-3">
              <Users className="h-3 w-3 mr-1" /> Find Specialists
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-3">
              Find a Doctor
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Search from {doctors.length}+ specialist gynecologists across
              Maharashtra. Book same-day appointments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-card border-b border-border py-5 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by doctor name..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-ocid="find-doctor-search"
              />
            </div>
            <select
              className="h-10 rounded-lg border border-input bg-background px-4 text-sm min-w-[150px]"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              data-ocid="find-doctor-location"
            >
              <option value="">All Locations</option>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <select
              className="h-10 rounded-lg border border-input bg-background px-4 text-sm min-w-[200px]"
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              data-ocid="find-doctor-speciality"
            >
              <option value="">All Specialities</option>
              {specialities.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <Button
              type="button"
              className="bg-primary hover:bg-primary/90 px-6"
              data-ocid="find-doctor-search-btn"
            >
              Search
            </Button>
            {(search || location || speciality) && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => {
                  setSearch("");
                  setLocation("");
                  setSpeciality("");
                }}
              >
                <X className="h-4 w-4" /> Clear
              </Button>
            )}
          </div>
          {!isLoading && (
            <p className="text-xs text-muted-foreground mt-2">
              {filtered.length} doctor{filtered.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>
      </section>

      {/* Doctor Grid */}
      <section className="container mx-auto px-4 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"].map(
              (sk) => (
                <div key={sk} className="space-y-3">
                  <Skeleton className="h-48 rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ),
            )}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20" data-ocid="find-doctor-empty">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No doctors found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search filters.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSearch("");
                setLocation("");
                setSpeciality("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visible.map((doctor, i) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => setSelectedDoctor(doctor)}
                    data-ocid="doctor-card-container"
                  >
                    <DoctorCard doctor={doctor} />
                  </button>
                </motion.div>
              ))}
            </div>

            {visibleCount < filtered.length && (
              <div className="text-center mt-8">
                <Button
                  type="button"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2"
                  onClick={() => setVisibleCount((v) => v + 8)}
                  data-ocid="load-more-doctors"
                >
                  Load More Doctors <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Doctor Detail Modal */}
      {selectedDoctor && (
        <dialog
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 m-0 max-w-none w-full h-full"
          onClick={() => setSelectedDoctor(null)}
          onKeyDown={(e) => e.key === "Escape" && setSelectedDoctor(null)}
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
                src={selectedDoctor.imageUrl}
                alt={selectedDoctor.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute top-3 right-3 bg-foreground/40 hover:bg-foreground/60 text-white rounded-full"
                onClick={() => setSelectedDoctor(null)}
                data-ocid="doctor-modal-close"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-4 left-4 right-4">
                <Badge className="bg-accent text-accent-foreground text-xs mb-2">
                  {selectedDoctor.speciality}
                </Badge>
                <h2 className="text-white font-bold font-display text-2xl">
                  {selectedDoctor.name}
                </h2>
                <p className="text-white/80 text-sm">
                  {selectedDoctor.qualification}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-muted/40 rounded-xl p-3">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg">
                      {selectedDoctor.rating}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedDoctor.reviewCount} reviews
                  </div>
                </div>
                <div className="bg-muted/40 rounded-xl p-3">
                  <div className="font-bold text-lg">
                    {selectedDoctor.experience}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Yrs experience
                  </div>
                </div>
                <div className="bg-muted/40 rounded-xl p-3">
                  <div className="font-bold text-lg">
                    ₹{selectedDoctor.consultationFee}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Consultation
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">About</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedDoctor.bio}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" /> Hospital
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedDoctor.hospitalName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedDoctor.location}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Languages className="h-4 w-4 text-primary" /> Languages
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedDoctor.languages.join(", ")}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Availability
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDoctor.availableDays.map((day) => (
                    <Badge key={day} variant="secondary" className="text-xs">
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" /> Areas of Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDoctor.expertise.map((exp) => (
                    <Badge
                      key={exp}
                      className="bg-primary/10 text-primary border-primary/20 text-xs"
                    >
                      {exp}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Link to="/book-appointment" className="flex-1">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                    Book Appointment
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedDoctor(null)}
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
