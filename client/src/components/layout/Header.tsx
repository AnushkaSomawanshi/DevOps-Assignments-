import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { getRoleLabel } from "@/lib/auth";
import { Link, useLocation } from "@tanstack/react-router";
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  LogOut,
  Menu,
  Phone,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Hospitals", href: "/hospitals" },
  {
    label: "Specialities",
    href: "/specialities",
    children: [
      { label: "Obstetrics & Gynecology", href: "/specialities#gynaecology" },
      { label: "IVF & Fertility", href: "/specialities#ivf" },
      { label: "Pediatrics", href: "/specialities#pediatrics" },
      { label: "Oncology", href: "/specialities#oncology" },
    ],
  },
  { label: "Health Packages", href: "/health-packages" },
  { label: "Blogs", href: "/blogs" },
  { label: "Videos", href: "/videos" },
  { label: "Labs", href: "/labs" },
  { label: "International", href: "/international-patients" },
  { label: "Find A Doctor", href: "/find-doctor" },
  {
    label: "More",
    href: "#",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Academics & CSR", href: "/academics-csr" },
      { label: "Career", href: "/career" },
      { label: "Blood Availability", href: "/blood-availability" },
      { label: "Second Opinion", href: "/second-opinion" },
      { label: "Teleconsultation", href: "/teleconsultation" },
      { label: "Help & Contact", href: "/contact" },
    ],
  },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, role, isAuthenticated, logout, dashboardRoute } = useAuth();

  const isActive = (href: string) =>
    href === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full" data-ocid="header-nav">
      {/* Top bar — emergency contact */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto flex items-center justify-between px-4 py-1.5 text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="h-3 w-3" />
              <span className="font-medium">+91 98765 43210</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-accent">
              <AlertCircle className="h-3 w-3" />
              <span className="font-semibold">
                Emergency: 1800-200-1234 (Toll Free)
              </span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/second-opinion"
              className="hover:underline opacity-90 transition-smooth"
            >
              Second Opinion
            </Link>
            <span className="opacity-40">|</span>
            <Link
              to="/contact"
              className="hover:underline opacity-90 transition-smooth"
            >
              Help
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-card border-b shadow-hospital">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 flex-shrink-0"
              data-ocid="header-logo"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-hospital">
                <span className="text-lg font-bold text-primary-foreground font-display">
                  G
                </span>
              </div>
              <div className="leading-tight">
                <div className="text-lg font-bold text-foreground font-display tracking-tight">
                  Gyne<span className="text-accent">Care</span>
                </div>
                <div className="text-[10px] text-muted-foreground font-body tracking-widest uppercase">
                  Hospital Network
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav
              className="hidden xl:flex items-center gap-0.5 flex-1 justify-center px-6"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <DropdownMenu key={link.label}>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-smooth
                          ${isActive(link.href) ? "text-primary bg-primary/5" : "text-foreground hover:text-primary hover:bg-primary/5"}`}
                      >
                        {link.label}
                        <ChevronDown className="h-3 w-3 opacity-60" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="center"
                      className="min-w-[200px]"
                    >
                      {link.children.map((child) => (
                        <DropdownMenuItem key={child.href} asChild>
                          <Link
                            to={child.href}
                            className="w-full cursor-pointer text-sm"
                          >
                            {child.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-smooth
                      ${isActive(link.href) ? "text-primary bg-primary/5" : "text-foreground hover:text-primary hover:bg-primary/5"}`}
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </nav>

            {/* CTA + user actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                to="/book-appointment"
                className="hidden lg:block"
                data-ocid="header-book-btn"
              >
                <Button
                  size="sm"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 shadow-hospital"
                >
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  Book Appointment
                </Button>
              </Link>

              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm font-medium transition-smooth hover:bg-muted/80"
                      data-ocid="header-user-menu"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {user.name[0].toUpperCase()}
                      </div>
                      <span className="hidden sm:block max-w-[100px] truncate">
                        {user.name.split(" ")[0]}
                      </span>
                      {role && (
                        <Badge
                          variant="secondary"
                          className="hidden sm:flex text-[10px] px-1.5 py-0"
                        >
                          {getRoleLabel(role)}
                        </Badge>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[180px]">
                    <DropdownMenuItem asChild>
                      <Link to={dashboardRoute} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        My Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-destructive cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login" data-ocid="header-login-btn">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex"
                  >
                    Sign In
                  </Button>
                </Link>
              )}

              {/* Mobile hamburger */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="xl:hidden"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <span className="text-sm font-bold text-primary-foreground font-display">
                          G
                        </span>
                      </div>
                      <span className="font-bold text-foreground font-display">
                        Gyne<span className="text-accent">Care</span>
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <nav className="space-y-1" aria-label="Mobile navigation">
                    {NAV_LINKS.map((link) => (
                      <div key={link.label}>
                        <Link
                          to={link.href === "#" ? "/" : link.href}
                          onClick={() => !link.children && setMobileOpen(false)}
                          className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth
                            ${isActive(link.href) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}
                        >
                          {link.label}
                        </Link>
                        {link.children && (
                          <div className="ml-4 mt-1 space-y-1 border-l-2 border-border pl-3">
                            {link.children.map((child) => (
                              <Link
                                key={child.href}
                                to={child.href}
                                onClick={() => setMobileOpen(false)}
                                className="block px-2 py-1.5 text-xs text-muted-foreground hover:text-primary transition-smooth rounded"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>

                  <div className="mt-6 space-y-2 border-t border-border pt-4">
                    <Link
                      to="/book-appointment"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Appointment
                      </Button>
                    </Link>
                    {!isAuthenticated && (
                      <Link to="/login" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                    )}
                    {isAuthenticated && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          logout();
                          setMobileOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
