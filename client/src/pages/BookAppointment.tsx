import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useBookingWizard,
  useCreateAppointment,
} from "@/hooks/useAppointments";
import { useAuth } from "@/hooks/useAuth";
import { useHospitals } from "@/hooks/useCatalog";
import { useDoctors } from "@/hooks/useDoctors";
import {
  createAppointmentFromBooking,
} from "@/lib/api";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  Baby,
  Building2,
  Calendar,
  CheckCircle,
  ChevronRight,
  CreditCard,
  Heart,
  MapPin,
  Microscope,
  Star,
  Stethoscope,
  UserCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Static data ──────────────────────────────────────────────────────────────

const CITIES = [
  {
    id: "Pune",
    name: "Pune",
    state: "Maharashtra",
    hospitals: 1,
    tagline: "Main Centre",
  },
  {
    id: "Mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    hospitals: 1,
    tagline: "Metro Branch",
  },
  {
    id: "Nashik",
    name: "Nashik",
    state: "Maharashtra",
    hospitals: 1,
    tagline: "City Branch",
  },
];

const DEPARTMENTS = [
  {
    id: "Obstetrics & Gynecology",
    label: "Obstetrics & Gynecology",
    icon: Baby,
    desc: "Prenatal, delivery, postnatal care",
  },
  {
    id: "IVF & Fertility",
    label: "IVF & Fertility",
    icon: Heart,
    desc: "IVF, PCOS, infertility treatment",
  },
  {
    id: "Gynecologic Oncology",
    label: "Gynecologic Oncology",
    icon: Microscope,
    desc: "Cancer screening & treatment",
  },
  {
    id: "Maternal-Fetal Medicine",
    label: "Maternal-Fetal Medicine",
    icon: Baby,
    desc: "High-risk pregnancy care",
  },
  {
    id: "Preventive Health",
    label: "Preventive Health",
    icon: Stethoscope,
    desc: "Health checkups & wellness",
  },
];

const STEP_ICONS = [
  MapPin,
  Building2,
  Stethoscope,
  UserCheck,
  Calendar,
  CreditCard,
];

// ─── Time slot generation ─────────────────────────────────────────────────────

function getTimeSlotsForPeriod() {
  return {
    morning: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
    afternoon: ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30"],
    evening: ["16:00", "16:30", "17:00", "17:30"],
  };
}

// ─── Generate next 14 days ────────────────────────────────────────────────────

function getNext14Days(): { value: string; label: string; day: string }[] {
  const days: { value: string; label: string; day: string }[] = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const val = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
    const day = d.toLocaleDateString("en-IN", { weekday: "short" });
    days.push({ value: val, label, day });
  }
  return days;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookAppointmentPage() {
  const {
    currentStep,
    bookingData,
    steps,
    updateBooking,
    nextStep,
    prevStep,
    reset,
  } = useBookingWizard();

  const { user } = useAuth();
  const { data: hospitals = [] } = useHospitals();
  const { data: doctors = [] } = useDoctors();
  const createAppointment = useCreateAppointment();
  const [patientName, setPatientName] = useState(user?.name ?? "");
  const [patientPhone, setPatientPhone] = useState(user?.phone ?? "");
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [appointmentId, setAppointmentId] = useState("");

  const next14 = getNext14Days();
  const timeSlots = getTimeSlotsForPeriod();

  const selectedDoctor = doctors.find((d) => d.id === bookingData.doctorId);
  const selectedHospital = hospitals.find((h) => h.id === bookingData.hospitalId);

  const handleConfirm = async () => {
    if (!patientName || !patientPhone) {
      toast.error("Please fill patient details");
      return;
    }
    try {
      const apptUser = {
        id: user?.id ?? "guest",
        name: patientName,
        email: user?.email ?? "",
        phone: patientPhone,
        role: (user?.role ?? "patient") as "patient" | "doctor" | "admin",
        createdAt: new Date().toISOString(),
      };
      const apptData = createAppointmentFromBooking(
        { ...bookingData, reason },
        apptUser,
        doctors,
        hospitals,
      );
      const result = await createAppointment.mutateAsync(apptData);
      setAppointmentId(result.id);
      setConfirmed(true);
    } catch {
      toast.error("Booking failed. Please try again.");
    }
  };

  const handleStartOver = () => {
    reset();
    setConfirmed(false);
    setAppointmentId("");
    setPatientName(user?.name ?? "");
    setPatientPhone(user?.phone ?? "");
    setReason("");
  };

  // Success screen
  if (confirmed) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center max-w-lg">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <Badge className="mb-4 bg-primary/10 text-primary">
            Booking Confirmed
          </Badge>
          <h1 className="text-3xl font-bold font-display text-foreground mb-2">
            Appointment Booked!
          </h1>
          <p className="text-muted-foreground mb-8">
            Your appointment has been successfully booked. You'll receive a
            confirmation on your registered phone.
          </p>
          <Card className="card-elevated w-full mb-6 text-left">
            <CardContent className="p-5 space-y-3">
              <div className="flex justify-between text-sm py-2 border-b border-border">
                <span className="text-muted-foreground">Appointment ID</span>
                <span className="font-bold text-primary">
                  #{appointmentId.slice(-6).toUpperCase()}
                </span>
              </div>
              {[
                { label: "Patient", value: patientName },
                { label: "Doctor", value: selectedDoctor?.name },
                { label: "Hospital", value: selectedHospital?.name },
                { label: "Department", value: bookingData.department },
                {
                  label: "Date",
                  value: bookingData.date ? formatDate(bookingData.date) : "",
                },
                {
                  label: "Time",
                  value: bookingData.timeSlot
                    ? formatTime(bookingData.timeSlot)
                    : "",
                },
                {
                  label: "Fee",
                  value: selectedDoctor
                    ? formatCurrency(selectedDoctor.consultationFee)
                    : "",
                },
              ].map(
                ({ label, value }) =>
                  value && (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-semibold text-foreground">
                        {value}
                      </span>
                    </div>
                  ),
              )}
            </CardContent>
          </Card>
          <div className="flex gap-3 w-full">
            <Link to="/dashboard/patient" className="flex-1">
              <Button className="w-full btn-primary">View Dashboard</Button>
            </Link>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleStartOver}
              type="button"
            >
              Book Another
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-muted/40 py-10 border-b border-border">
        <div className="container mx-auto px-4">
          <Badge variant="secondary" className="mb-3">
            Schedule Visit
          </Badge>
          <h1 className="text-4xl font-bold font-display text-foreground">
            Book an Appointment
          </h1>
          <p className="text-muted-foreground mt-2">
            Complete your booking in {steps.length} simple steps
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Stepper */}
        <div className="mb-10 overflow-x-auto pb-2">
          <div className="flex min-w-max gap-0 mx-auto max-w-3xl">
            {steps.map((step, i) => {
              const StepIcon = STEP_ICONS[i];
              const isActive = step.step === currentStep;
              const isDone = step.step < currentStep;
              return (
                <div key={step.step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-smooth ${isDone ? "bg-primary border-primary text-primary-foreground" : isActive ? "bg-accent border-accent text-accent-foreground" : "bg-background border-border text-muted-foreground"}`}
                    >
                      {isDone ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    <span
                      className={`text-[10px] mt-1 font-medium text-center max-w-[72px] leading-tight ${isActive ? "text-accent" : isDone ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-1 ${isDone ? "bg-primary" : "bg-border"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Card className="card-elevated max-w-2xl mx-auto">
          <CardContent className="p-8">
            {/* Step 1: Location */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-bold font-display mb-2">
                  Select Location
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Choose the city for your appointment
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {CITIES.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => {
                        updateBooking({ locationId: city.id });
                        nextStep();
                      }}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-smooth hover:border-primary hover:bg-primary/5 ${bookingData.locationId === city.id ? "border-primary bg-primary/5" : "border-border"}`}
                      data-ocid={`location-${city.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {city.name}, {city.state}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {city.hospitals} hospital • {city.tagline}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Hospital */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-bold font-display mb-2">
                  Choose Hospital
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Hospitals in {bookingData.locationId}
                </p>
                <div className="grid grid-cols-1 gap-4">
                  {hospitals.filter(
                    (h) =>
                      !bookingData.locationId ||
                      h.city === bookingData.locationId,
                  ).map((hosp) => (
                    <button
                      key={hosp.id}
                      type="button"
                      onClick={() => {
                        updateBooking({ hospitalId: hosp.id });
                        nextStep();
                      }}
                      className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-smooth hover:border-primary hover:bg-primary/5 ${bookingData.hospitalId === hosp.id ? "border-primary bg-primary/5" : "border-border"}`}
                      data-ocid={`hospital-${hosp.id}`}
                    >
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground">
                          {hosp.name}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {hosp.address}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {hosp.facilities.slice(0, 3).map((f) => (
                            <span
                              key={f}
                              className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
                            >
                              {f}
                            </span>
                          ))}
                          {hosp.facilities.length > 3 && (
                            <span className="text-[10px] text-primary">
                              +{hosp.facilities.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Department */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-bold font-display mb-2">
                  Select Department
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Choose the medical department for your visit
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {DEPARTMENTS.map((dept) => {
                    const Icon = dept.icon;
                    return (
                      <button
                        key={dept.id}
                        type="button"
                        onClick={() => {
                          updateBooking({ department: dept.id });
                          nextStep();
                        }}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-smooth hover:border-primary hover:bg-primary/5 ${bookingData.department === dept.id ? "border-primary bg-primary/5" : "border-border"}`}
                        data-ocid={`dept-${dept.id}`}
                      >
                        <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-accent" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground">
                            {dept.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {dept.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Doctor */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-xl font-bold font-display mb-2">
                  Choose Doctor
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Available specialists for {bookingData.department}
                </p>
                <div className="grid grid-cols-1 gap-4">
                  {(bookingData.department
                    ? doctors.filter(
                        (d) =>
                          d.speciality
                            .toLowerCase()
                            .includes(
                              bookingData.department
                                ?.split(" ")[0]
                                .toLowerCase() ?? "",
                            ) || bookingData.department === "Preventive Health",
                      )
                    : doctors
                  ).map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => {
                        updateBooking({ doctorId: doc.id });
                        nextStep();
                      }}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-smooth hover:border-primary hover:bg-primary/5 ${bookingData.doctorId === doc.id ? "border-primary bg-primary/5" : "border-border"}`}
                      data-ocid={`doctor-${doc.id}`}
                    >
                      <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-border">
                        <span className="text-xl font-bold text-muted-foreground">
                          {doc.name.split(" ")[1][0]}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground">
                          {doc.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doc.qualification}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doc.experience} years experience
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="flex items-center gap-1 text-xs text-amber-600">
                            <Star className="h-3 w-3 fill-current" />
                            {doc.rating}
                          </span>
                          <span className="text-xs font-semibold text-primary">
                            {formatCurrency(doc.consultationFee)}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                  {doctors.filter((d) =>
                    bookingData.department
                      ? d.speciality
                          .toLowerCase()
                          .includes(
                            bookingData.department
                              ?.split(" ")[0]
                              .toLowerCase() ?? "",
                          )
                      : true,
                  ).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Showing all available doctors for this department.</p>
                      {doctors.slice(0, 2).map((doc) => (
                        <button
                          key={doc.id}
                          type="button"
                          onClick={() => {
                            updateBooking({ doctorId: doc.id });
                            nextStep();
                          }}
                          className="flex items-center gap-4 p-4 rounded-xl border-2 border-border text-left transition-smooth hover:border-primary w-full mt-3"
                          data-ocid={`doctor-fallback-${doc.id}`}
                        >
                          <span className="font-semibold">{doc.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Date & Time */}
            {currentStep === 5 && (
              <div>
                <h2 className="text-xl font-bold font-display mb-2">
                  Pick Date & Time
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Select your preferred appointment slot
                </p>

                {/* Date picker strip */}
                <div className="mb-6">
                  <Label className="text-sm font-semibold mb-3 block">
                    Select Date
                  </Label>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {next14.map((d) => (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => updateBooking({ date: d.value })}
                        className={`flex flex-col items-center p-3 rounded-xl border-2 min-w-[56px] transition-smooth flex-shrink-0 ${bookingData.date === d.value ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}
                        data-ocid={`date-${d.value}`}
                      >
                        <span className="text-[10px] font-medium">{d.day}</span>
                        <span className="text-base font-bold leading-tight">
                          {d.label.split(" ")[0]}
                        </span>
                        <span className="text-[10px]">
                          {d.label.split(" ")[1]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time slots */}
                {bookingData.date && (
                  <div className="space-y-4">
                    {[
                      {
                        period: "Morning",
                        slots: timeSlots.morning,
                        icon: "🌅",
                      },
                      {
                        period: "Afternoon",
                        slots: timeSlots.afternoon,
                        icon: "☀️",
                      },
                      {
                        period: "Evening",
                        slots: timeSlots.evening,
                        icon: "🌆",
                      },
                    ].map(({ period, slots, icon }) => (
                      <div key={period}>
                        <p className="text-sm font-semibold text-muted-foreground mb-2">
                          {icon} {period}
                        </p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {slots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => updateBooking({ timeSlot: slot })}
                              className={`p-2.5 text-sm rounded-lg border-2 font-medium transition-smooth ${bookingData.timeSlot === slot ? "bg-primary border-primary text-primary-foreground" : "border-border hover:border-primary hover:bg-primary/5"}`}
                              data-ocid={`slot-${slot}`}
                            >
                              {formatTime(slot)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Confirm */}
            {currentStep === 6 && (
              <div>
                <h2 className="text-xl font-bold font-display mb-2">
                  Confirm Booking
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Review your appointment details and confirm
                </p>

                {/* Summary */}
                <div className="bg-muted/40 rounded-xl p-5 mb-5 space-y-2.5">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                    Appointment Summary
                  </p>
                  {[
                    { label: "Location", value: bookingData.locationId },
                    { label: "Hospital", value: selectedHospital?.name },
                    { label: "Department", value: bookingData.department },
                    { label: "Doctor", value: selectedDoctor?.name },
                    {
                      label: "Date",
                      value: bookingData.date
                        ? formatDate(bookingData.date)
                        : "",
                    },
                    {
                      label: "Time",
                      value: bookingData.timeSlot
                        ? formatTime(bookingData.timeSlot)
                        : "",
                    },
                    {
                      label: "Consultation Fee",
                      value: selectedDoctor
                        ? formatCurrency(selectedDoctor.consultationFee)
                        : "",
                    },
                  ].map(
                    ({ label, value }) =>
                      value && (
                        <div
                          key={label}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-semibold text-foreground">
                            {value}
                          </span>
                        </div>
                      ),
                  )}
                </div>

                {/* Patient details */}
                <div className="space-y-4 mb-5">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Patient Details
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="patient-name">Full Name</Label>
                      <Input
                        id="patient-name"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="Your full name"
                        className="mt-1"
                        data-ocid="patient-name-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="patient-phone">Phone Number</Label>
                      <Input
                        id="patient-phone"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="mt-1"
                        data-ocid="patient-phone-input"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="reason">Reason for Visit (optional)</Label>
                    <Textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Briefly describe your symptoms or reason for visit"
                      className="mt-1 resize-none"
                      rows={3}
                      data-ocid="reason-input"
                    />
                  </div>
                </div>

                <Button
                  className="w-full btn-accent font-semibold text-base py-3 h-auto"
                  onClick={handleConfirm}
                  disabled={
                    createAppointment.isPending || !patientName || !patientPhone
                  }
                  data-ocid="confirm-booking-btn"
                  type="button"
                >
                  {createAppointment.isPending
                    ? "Confirming..."
                    : "Confirm Appointment"}
                </Button>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-border">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  className="flex-1"
                  type="button"
                  data-ocid="prev-step-btn"
                >
                  Back
                </Button>
              )}
              {currentStep === 5 && (
                <Button
                  onClick={nextStep}
                  className="flex-1 btn-primary"
                  disabled={!bookingData.date || !bookingData.timeSlot}
                  type="button"
                  data-ocid="next-step-btn"
                >
                  Continue
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>{" "}
          to pre-fill your details.
        </p>
      </div>
    </Layout>
  );
}
