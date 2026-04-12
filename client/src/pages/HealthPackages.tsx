import { Layout } from "@/components/layout/Layout";
import { PackageCard } from "@/components/ui/PackageCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useHealthPackages } from "@/hooks/useCatalog";
import type { HealthPackage } from "@/types";
import { Link } from "@tanstack/react-router";
import { CheckCircle, FlaskConical, ShieldCheck, Tag, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

type GenderFilter = "all" | "female" | "both";

const WHY_CHOOSE = [
  {
    icon: ShieldCheck,
    title: "NABL Accredited Labs",
    desc: "All tests conducted in our state-of-the-art NABL-certified pathology labs.",
  },
  {
    icon: FlaskConical,
    title: "Same-Day Results",
    desc: "Most basic tests deliver reports within 6-8 hours of sample collection.",
  },
  {
    icon: CheckCircle,
    title: "Home Collection",
    desc: "Free sample collection at your doorstep for all packages above ₹1,999.",
  },
  {
    icon: Tag,
    title: "Best Price Guarantee",
    desc: "Our packages are priced 30-40% below market rates for equivalent tests.",
  },
];

const GENDER_FILTERS: Array<{ id: GenderFilter; label: string }> = [
  { id: "all", label: "All Packages" },
  { id: "female", label: "For Women" },
  { id: "both", label: "For Everyone" },
];

export default function HealthPackagesPage() {
  const { data: packages = [] } = useHealthPackages();
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");
  const [selectedPackage, setSelectedPackage] = useState<HealthPackage | null>(
    null,
  );

  const filtered = packages.filter((p) => {
    if (genderFilter === "all") return true;
    if (genderFilter === "female") return p.gender === "female";
    if (genderFilter === "both") return p.gender === "both";
    return true;
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge variant="secondary" className="mb-3">
              <ShieldCheck className="h-3 w-3 mr-1" /> Preventive Care
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-4">
              Preventive Health Packages
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mb-6">
              Curated health checkup bundles for comprehensive women's wellness
              — from cancer screening to fertility assessment, all at affordable
              prices.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-primary/10 text-primary rounded-full px-4 py-1.5 font-medium">
                5 Curated Packages
              </span>
              <span className="bg-accent/10 text-accent rounded-full px-4 py-1.5 font-medium">
                NABL Certified Labs
              </span>
              <span className="bg-primary/10 text-primary rounded-full px-4 py-1.5 font-medium">
                Home Collection Available
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-card border-b border-border py-5">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground">
              Filter by:
            </span>
            {GENDER_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setGenderFilter(f.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-smooth ${genderFilter === f.id ? "bg-primary text-primary-foreground shadow-hospital" : "bg-muted hover:bg-muted/70 text-muted-foreground"}`}
                data-ocid={`package-filter-${f.id}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Package Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <button
                type="button"
                className="w-full text-left"
                onClick={() => setSelectedPackage(pkg)}
                data-ocid="package-card-view"
              >
                <PackageCard pkg={pkg} />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-14 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge variant="secondary" className="mb-3">
              Why GyneCare Packages
            </Badge>
            <h2 className="text-3xl font-bold font-display text-foreground mb-2">
              Everything Included
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our health packages combine quality, convenience, and
              affordability.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="card-elevated text-center p-6">
                  <CardContent className="p-0">
                    <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-xl bg-primary/10 mb-4">
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Package Detail Modal */}
      {selectedPackage && (
        <dialog
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 m-0 max-w-none w-full h-full"
          onClick={() => setSelectedPackage(null)}
          onKeyDown={(e) => e.key === "Escape" && setSelectedPackage(null)}
          open
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 rounded-t-2xl relative">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute top-4 right-4 rounded-full"
                onClick={() => setSelectedPackage(null)}
                data-ocid="package-modal-close"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 mb-4">
                <FlaskConical className="h-7 w-7 text-primary" />
              </div>
              {selectedPackage.popular && (
                <Badge className="bg-accent text-accent-foreground text-xs mb-2">
                  MOST POPULAR
                </Badge>
              )}
              <Badge
                variant="secondary"
                className="text-xs mb-2 flex w-fit items-center gap-1"
              >
                <Tag className="h-2.5 w-2.5" /> {selectedPackage.category}
              </Badge>
              <h2 className="text-2xl font-bold font-display text-foreground mb-2">
                {selectedPackage.name}
              </h2>
              <p className="text-muted-foreground text-sm">
                {selectedPackage.description}
              </p>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between bg-muted/40 rounded-xl p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Package Price</p>
                  <p className="text-3xl font-bold text-foreground">
                    ₹{selectedPackage.price.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-muted-foreground line-through">
                    ₹{selectedPackage.originalPrice.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="text-right">
                  <Badge className="bg-primary/10 text-primary text-sm px-3 py-1">
                    {Math.round(
                      ((selectedPackage.originalPrice - selectedPackage.price) /
                        selectedPackage.originalPrice) *
                        100,
                    )}
                    % OFF
                  </Badge>
                  {selectedPackage.ageGroup && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Age: {selectedPackage.ageGroup}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  All Included Tests ({selectedPackage.testCount} total)
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedPackage.tests.map((test) => (
                    <div
                      key={test}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      {test}
                    </div>
                  ))}
                  {selectedPackage.testCount > selectedPackage.tests.length && (
                    <p className="text-xs text-primary font-medium col-span-2">
                      +
                      {selectedPackage.testCount - selectedPackage.tests.length}{" "}
                      additional tests
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Link to="/book-appointment" className="flex-1">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                    Book This Package
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedPackage(null)}
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
