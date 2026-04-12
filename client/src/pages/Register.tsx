import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/hooks/useAuth";
import { registerUser } from "@/lib/api";
import { isValidEmail, isValidPhone } from "@/lib/utils";
import type { UserRole } from "@/types";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Baby,
  ChevronRight,
  Eye,
  EyeOff,
  Heart,
  Shield,
  Stethoscope,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const DEMO_OTP = "123456";

const DOCTOR_SPECIALITIES = [
  "Obstetrics & Gynecology",
  "Infertility & IVF",
  "Gynecologic Oncology",
  "Maternal-Fetal Medicine",
  "Menopause Specialist",
  "General Practice",
];

const ROLE_ROUTES: Record<UserRole, string> = {
  patient: "/dashboard/patient",
  doctor: "/dashboard/doctor",
  admin: "/dashboard/admin",
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { loginAsRole } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "patient" as UserRole,
    password: "",
    confirmPassword: "",
    abhaId: "",
    otp: "",
    speciality: "",
    qualifications: "",
  });

  const set = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSendOtp = () => {
    if (!form.phone || !isValidPhone(form.phone)) {
      toast.error("Enter a valid 10-digit phone number first");
      return;
    }
    setOtpSent(true);
    toast.success("OTP sent! Use 123456 for demo.");
  };

  const handleVerifyOtp = () => {
    if (form.otp !== DEMO_OTP) {
      toast.error("Invalid OTP. Use 123456 for demo.");
      return;
    }
    setOtpVerified(true);
    toast.success("Phone number verified!");
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!isValidEmail(form.email)) {
      toast.error("Enter a valid email");
      return;
    }
    if (!isValidPhone(form.phone)) {
      toast.error("Enter a valid 10-digit phone");
      return;
    }
    if (!otpVerified) {
      toast.error("Please verify your phone number first");
      return;
    }
    if (!form.password || form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.role === "doctor") {
      if (!form.speciality) {
        toast.error("Please select a speciality");
        return;
      }
      if (!form.qualifications.trim()) {
        toast.error("Please enter your qualifications");
        return;
      }
    }
    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const createdUser = await registerUser({
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role,
      password: form.password,
      abhaId: form.abhaId || undefined,
      speciality: form.speciality || undefined,
      qualifications: form.qualifications || undefined,
    });
    loginAsRole(createdUser);
    toast.success("Account created successfully! Welcome to GyneCare.");
    void navigate({ to: ROLE_ROUTES[form.role] });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/assets/generated/hero-gynecology.dim_1400x600.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card/20">
              <Heart className="h-5 w-5 text-primary-foreground fill-current" />
            </div>
            <span className="font-bold font-display text-primary-foreground text-xl">
              GyneCare
            </span>
          </div>
          <h1 className="text-4xl font-bold font-display text-primary-foreground leading-tight mb-4">
            Join Maharashtra's
            <br />
            Trusted Health Platform
          </h1>
          <p className="text-primary-foreground/70 text-lg max-w-sm">
            Register once to access appointments, medical records, pregnancy
            tracking, and more.
          </p>
        </div>
        <div className="relative z-10 space-y-3">
          {[
            { icon: Baby, text: "Pregnancy & menstrual cycle tracker" },
            { icon: Stethoscope, text: "Book appointments in 60 seconds" },
            {
              icon: Shield,
              text: "ABHA integration for digital health records",
            },
          ].map((feat) => (
            <div
              key={feat.text}
              className="flex items-center gap-3 bg-card/10 rounded-xl p-3"
            >
              <feat.icon className="h-5 w-5 text-primary-foreground flex-shrink-0" />
              <span className="text-sm text-primary-foreground/90">
                {feat.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md py-8"
        >
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Heart className="h-6 w-6 text-accent fill-accent/30" />
            <span className="font-bold font-display text-foreground text-xl">
              GyneCare
            </span>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold font-display text-foreground">
                Create Account
              </h2>
              <p className="text-muted-foreground mt-1">
                Step {step} of 2 —{" "}
                {step === 1 ? "Your Details" : "Review & Confirm"}
              </p>
            </div>
            <div className="flex gap-1">
              {[1, 2].map((s) => (
                <div
                  key={s}
                  className={`h-2 w-10 rounded-full transition-smooth ${s <= step ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>
          </div>

          {step === 1 && (
            <Card className="card-elevated shadow-hospital">
              <CardContent className="p-6">
                <form onSubmit={handleNextStep} className="space-y-4">
                  {/* Name */}
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="e.g. Prachi Desai"
                      className="mt-1"
                      data-ocid="register-name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="you@example.com"
                      className="mt-1"
                      data-ocid="register-email"
                    />
                  </div>

                  {/* Phone + OTP Verification */}
                  <div>
                    <Label htmlFor="phone">Mobile Number</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="9876543210"
                        className="flex-1"
                        data-ocid="register-phone"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-shrink-0 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        onClick={handleSendOtp}
                      >
                        {otpSent ? "Resend" : "Send OTP"}
                      </Button>
                    </div>
                    {otpSent && !otpVerified && (
                      <div className="mt-2">
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="6-digit OTP"
                            maxLength={6}
                            className="tracking-widest text-center"
                            value={form.otp}
                            onChange={(e) =>
                              set("otp", e.target.value.replace(/\D/g, ""))
                            }
                            data-ocid="register-otp"
                          />
                          <Button
                            type="button"
                            size="sm"
                            className="flex-shrink-0 bg-primary hover:bg-primary/90"
                            onClick={handleVerifyOtp}
                          >
                            Verify
                          </Button>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Demo OTP: {DEMO_OTP}
                        </p>
                      </div>
                    )}
                    {otpVerified && (
                      <p className="text-xs text-primary font-medium mt-1 flex items-center gap-1">
                        <Shield className="h-3 w-3" /> Phone verified
                      </p>
                    )}
                  </div>

                  {/* Role */}
                  <div>
                    <Label className="mb-2 block">I am a</Label>
                    <RadioGroup
                      value={form.role}
                      onValueChange={(v) => set("role", v)}
                      className="flex gap-4"
                      data-ocid="register-role"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="patient" id="r-patient" />
                        <Label htmlFor="r-patient">Patient</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="doctor" id="r-doctor" />
                        <Label htmlFor="r-doctor">Doctor</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Doctor-specific */}
                  {form.role === "doctor" && (
                    <>
                      <div>
                        <Label htmlFor="reg-speciality">Speciality</Label>
                        <select
                          id="reg-speciality"
                          className="w-full mt-1 h-10 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                          value={form.speciality}
                          onChange={(e) => set("speciality", e.target.value)}
                          data-ocid="register-speciality"
                        >
                          <option value="">Select speciality</option>
                          {DOCTOR_SPECIALITIES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="reg-qualifications">
                          Qualifications
                        </Label>
                        <Input
                          id="reg-qualifications"
                          placeholder="e.g. MD, DGO, FRCOG"
                          className="mt-1"
                          value={form.qualifications}
                          onChange={(e) =>
                            set("qualifications", e.target.value)
                          }
                          data-ocid="register-qualifications"
                        />
                      </div>
                    </>
                  )}

                  {/* ABHA (Optional) */}
                  <div>
                    <Label
                      htmlFor="reg-abha"
                      className="flex items-center gap-2"
                    >
                      ABHA ID
                      <Badge variant="secondary" className="text-[10px]">
                        Optional
                      </Badge>
                    </Label>
                    <Input
                      id="reg-abha"
                      placeholder="14-digit ABHA number"
                      className="mt-1"
                      value={form.abhaId}
                      onChange={(e) => set("abhaId", e.target.value)}
                      data-ocid="register-abha"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Link your Ayushman Bharat Health Account
                    </p>
                  </div>

                  {/* Password */}
                  <div>
                    <Label htmlFor="reg-password">Password</Label>
                    <div className="relative mt-1">
                      <Input
                        id="reg-password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => set("password", e.target.value)}
                        placeholder="Min. 6 characters"
                        className="pr-9"
                        data-ocid="register-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <Label htmlFor="reg-confirm">Confirm Password</Label>
                    <Input
                      id="reg-confirm"
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) => set("confirmPassword", e.target.value)}
                      placeholder="Repeat password"
                      className="mt-1"
                      data-ocid="register-confirm-password"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 font-semibold h-11 gap-2"
                    data-ocid="register-next"
                  >
                    Continue <ChevronRight className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="card-elevated shadow-hospital">
              <CardContent className="p-6">
                <form onSubmit={handleRegister} className="space-y-5">
                  <h3 className="font-semibold text-foreground mb-3">
                    Review Your Details
                  </h3>
                  <div className="bg-muted/40 rounded-xl p-4 space-y-2.5">
                    {[
                      { label: "Name", value: form.name },
                      {
                        label: "Role",
                        value:
                          form.role.charAt(0).toUpperCase() +
                          form.role.slice(1),
                      },
                      { label: "Email", value: form.email },
                      { label: "Phone", value: form.phone },
                      ...(form.role === "doctor"
                        ? [
                            { label: "Speciality", value: form.speciality },
                            {
                              label: "Qualifications",
                              value: form.qualifications,
                            },
                          ]
                        : []),
                      ...(form.abhaId
                        ? [{ label: "ABHA ID", value: form.abhaId }]
                        : []),
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {row.label}
                        </span>
                        <span className="font-medium text-foreground">
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    By registering, you agree to GyneCare's{" "}
                    <Link
                      to="/contact"
                      className="text-primary hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/contact"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                      disabled={loading}
                      data-ocid="register-submit"
                    >
                      {loading ? "Creating Account…" : "Create Account"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
              data-ocid="register-login-link"
            >
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
