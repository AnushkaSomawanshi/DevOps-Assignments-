import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { loginUser } from "@/lib/api";
import { isValidEmail } from "@/lib/utils";
import type { UserRole } from "@/types";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Eye,
  EyeOff,
  Heart,
  Phone,
  Shield,
  Smartphone,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

type LoginMethod = "password" | "otp";

const DEMO_ACCOUNTS: Array<{
  role: UserRole;
  email: string;
  name: string;
  phone: string;
}> = [
  {
    role: "patient",
    email: "patient@demo.in",
    name: "Prachi Desai",
    phone: "9876543210",
  },
  {
    role: "doctor",
    email: "doctor@demo.in",
    name: "Dr. Priya Sharma",
    phone: "9876543211",
  },
  {
    role: "admin",
    email: "admin@demo.in",
    name: "Admin User",
    phone: "9876543212",
  },
];

const DEMO_OTP = "123456";

const ROLE_ROUTES: Record<UserRole, string> = {
  patient: "/dashboard/patient",
  doctor: "/dashboard/doctor",
  admin: "/dashboard/admin",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginAsRole } = useAuth();

  const [method, setMethod] = useState<LoginMethod>("password");
  const [role, setRole] = useState<UserRole>("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const doLogin = async (account: (typeof DEMO_ACCOUNTS)[number]) => {
    setLoading(true);
    const user = await loginUser({
      email: account.email,
      role: account.role,
      password: password || "demo123",
    }).catch(() => ({
      id: `user-${account.role}`,
      name: account.name,
      email: account.email,
      phone: account.phone,
      role: account.role,
      createdAt: new Date().toISOString(),
    }));
    loginAsRole(user);
    toast.success(`Welcome back, ${account.name.split(" ")[0]}!`);
    void navigate({ to: ROLE_ROUTES[account.role] });
    setLoading(false);
  };

  const handleSendOtp = () => {
    if (!email.trim()) {
      toast.error("Enter your email or phone first");
      return;
    }
    setOtpSent(true);
    toast.success("OTP sent! Use 123456 for demo.");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Email or phone is required");
      return;
    }

    if (method === "otp") {
      if (!otpSent) {
        toast.error("Please send OTP first");
        return;
      }
      if (otp !== DEMO_OTP) {
        toast.error("Invalid OTP. Use 123456 for demo.");
        return;
      }
    } else {
      if (!isValidEmail(email)) {
        toast.error("Enter a valid email address");
        return;
      }
      if (!password) {
        toast.error("Password is required");
        return;
      }
    }

    const demo =
      DEMO_ACCOUNTS.find((a) => a.email === email) ??
      DEMO_ACCOUNTS.find((a) => a.role === role);
    if (!demo) {
      toast.error("No account found. Try a demo account below.");
      return;
    }
    await doLogin(demo);
  };

  const loginAsDemo = (demo: (typeof DEMO_ACCOUNTS)[number]) => doLogin(demo);

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
            Welcome Back to
            <br />
            Your Health Portal
          </h1>
          <p className="text-primary-foreground/70 text-lg max-w-sm">
            Access your appointments, medical records, pregnancy tracker, and
            more — all in one place.
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-3">
          {[
            { icon: Shield, label: "Secure & Private" },
            { icon: Smartphone, label: "OTP Login" },
            { icon: User, label: "Role-Based Access" },
            { icon: Heart, label: "NABH Certified" },
          ].map((feat) => (
            <div
              key={feat.label}
              className="flex items-center gap-2.5 bg-card/10 rounded-xl p-3"
            >
              <feat.icon className="h-4 w-4 text-primary-foreground flex-shrink-0" />
              <span className="text-sm text-primary-foreground/90">
                {feat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Heart className="h-6 w-6 text-accent fill-accent/30" />
            <span className="font-bold font-display text-foreground text-xl">
              GyneCare
            </span>
          </div>

          <h2 className="text-3xl font-bold font-display text-foreground mb-2">
            Sign In
          </h2>
          <p className="text-muted-foreground mb-8">
            Access your patient or doctor portal
          </p>

          {/* Role Selector */}
          <div className="grid grid-cols-3 gap-2 mb-6 bg-muted rounded-xl p-1">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                type="button"
                onClick={() => setRole(acc.role)}
                className={`py-2.5 rounded-lg text-sm font-semibold transition-smooth capitalize ${role === acc.role ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                data-ocid={`role-${acc.role}`}
              >
                {acc.role}
              </button>
            ))}
          </div>

          {/* Login Method Tabs */}
          <div className="flex gap-4 mb-6 border-b border-border">
            {(["password", "otp"] as LoginMethod[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMethod(m);
                  setOtpSent(false);
                  setOtp("");
                }}
                className={`pb-2 text-sm font-medium transition-smooth border-b-2 -mb-px ${method === m ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                data-ocid={`login-method-${m}`}
              >
                {m === "password" ? "Password" : "OTP Login"}
              </button>
            ))}
          </div>

          <Card className="card-elevated shadow-hospital">
            <CardContent className="p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="text-sm font-medium">
                    {method === "otp" ? "Mobile Number / Email" : "Email"}
                  </Label>
                  <div className="relative mt-1.5">
                    {method === "otp" ? (
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    ) : (
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    )}
                    <Input
                      id="login-email"
                      type={method === "otp" ? "tel" : "email"}
                      placeholder={
                        method === "otp" ? "+91 XXXXX XXXXX" : "you@example.com"
                      }
                      className="pl-9"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      data-ocid="login-email"
                    />
                  </div>
                </div>

                {method === "password" && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <Label
                        htmlFor="login-password"
                        className="text-sm font-medium"
                      >
                        Password
                      </Label>
                      <button
                        type="button"
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pr-9"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        data-ocid="login-password"
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
                )}

                {method === "otp" && (
                  <div className="space-y-2">
                    {!otpSent ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        onClick={handleSendOtp}
                      >
                        Send OTP
                      </Button>
                    ) : (
                      <div>
                        <Label
                          htmlFor="login-otp"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          Enter OTP
                          <Badge variant="secondary" className="text-[10px]">
                            Demo: {DEMO_OTP}
                          </Badge>
                        </Label>
                        <Input
                          id="login-otp"
                          type="text"
                          inputMode="numeric"
                          placeholder="6-digit OTP"
                          maxLength={6}
                          className="mt-1.5 tracking-widest text-center text-lg"
                          value={otp}
                          onChange={(e) =>
                            setOtp(e.target.value.replace(/\D/g, ""))
                          }
                          data-ocid="login-otp"
                        />
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="text-xs text-primary hover:underline mt-1"
                        >
                          Resend OTP
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 font-semibold h-11"
                  disabled={loading}
                  data-ocid="login-submit"
                >
                  {loading ? "Signing in…" : "Sign In"}
                </Button>
              </form>

              {/* Quick Demo Login */}
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-center text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-wider">
                  Quick Demo Login
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {DEMO_ACCOUNTS.map((demo) => (
                    <button
                      key={demo.role}
                      type="button"
                      onClick={() => loginAsDemo(demo)}
                      disabled={loading}
                      className="p-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 text-center transition-smooth"
                      data-ocid={`demo-login-${demo.role}`}
                    >
                      <Badge
                        variant="secondary"
                        className="text-[10px] mb-1 capitalize"
                      >
                        {demo.role}
                      </Badge>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {demo.name.split(" ")[0]}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-4">
            New to GyneCare?{" "}
            <Link
              to="/register"
              className="text-primary hover:underline font-medium"
              data-ocid="login-register-link"
            >
              Create Account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
