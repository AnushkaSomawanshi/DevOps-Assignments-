import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, FlaskConical, Home, Star, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const LAB_TESTS = [
  {
    id: "t1",
    name: "Complete Blood Count (CBC)",
    desc: "Evaluates overall health and detects disorders like anaemia and infection.",
    time: "Same Day",
    price: 350,
    category: "Haematology",
  },
  {
    id: "t2",
    name: "Lipid Profile",
    desc: "Measures cholesterol levels and cardiovascular risk factors.",
    time: "Same Day",
    price: 550,
    category: "Biochemistry",
  },
  {
    id: "t3",
    name: "Blood Sugar (FBS + PPBS)",
    desc: "Fasting and post-prandial blood glucose screening for diabetes.",
    time: "4 Hours",
    price: 180,
    category: "Biochemistry",
  },
  {
    id: "t4",
    name: "HbA1c (Glycated Haemoglobin)",
    desc: "3-month average blood sugar control for diabetes management.",
    time: "Same Day",
    price: 480,
    category: "Biochemistry",
  },
  {
    id: "t5",
    name: "Thyroid Panel (TSH, T3, T4)",
    desc: "Assesses thyroid gland function and hormone levels.",
    time: "Same Day",
    price: 650,
    category: "Endocrinology",
  },
  {
    id: "t6",
    name: "Pregnancy Test (Beta-hCG)",
    desc: "Highly sensitive blood test to confirm pregnancy early.",
    time: "4 Hours",
    price: 350,
    category: "Obstetrics",
  },
  {
    id: "t7",
    name: "Pap Smear (Cervical Cytology)",
    desc: "Cervical cancer screening — recommended annually for all women 21+.",
    time: "2–3 Days",
    price: 750,
    category: "Gynecology",
  },
  {
    id: "t8",
    name: "Culture & Sensitivity",
    desc: "Identifies bacterial infection and appropriate antibiotic treatment.",
    time: "3–5 Days",
    price: 900,
    category: "Microbiology",
  },
  {
    id: "t9",
    name: "Vitamin D3 & B12 Panel",
    desc: "Screens for common nutritional deficiencies in women.",
    time: "Same Day",
    price: 1100,
    category: "Nutrition",
  },
  {
    id: "t10",
    name: "PCOS Hormone Panel",
    desc: "LH, FSH, Testosterone, DHEAS for PCOS diagnosis and monitoring.",
    time: "Same Day",
    price: 1800,
    category: "Gynecology",
  },
  {
    id: "t11",
    name: "Prenatal Screening (NT Scan)",
    desc: "First-trimester nuchal translucency scan with serum markers.",
    time: "2 Days",
    price: 2200,
    category: "Obstetrics",
  },
  {
    id: "t12",
    name: "Iron Studies (Serum Ferritin)",
    desc: "Assesses iron stores and diagnoses iron-deficiency anaemia.",
    time: "Same Day",
    price: 420,
    category: "Haematology",
  },
];

const CATEGORIES = [
  "All",
  "Haematology",
  "Biochemistry",
  "Gynecology",
  "Obstetrics",
  "Endocrinology",
  "Microbiology",
  "Nutrition",
];

export default function LabsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");

  const filtered =
    activeCategory === "All"
      ? LAB_TESTS
      : LAB_TESTS.filter((t) => t.category === activeCategory);

  const toggleTest = (id: string) => {
    setSelectedTests((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const handleHomeCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !date) {
      toast.error("Please fill in all fields");
      return;
    }
    if (selectedTests.length === 0) {
      toast.error("Select at least one test");
      return;
    }
    toast.success(
      "Home sample collection booked! Phlebotomist will arrive between 6–8 AM.",
    );
    setAddress("");
    setDate("");
    setSelectedTests([]);
  };

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-muted/40 py-10 border-b border-border">
        <div className="container mx-auto px-4">
          <Badge variant="secondary" className="mb-3">
            Diagnostics
          </Badge>
          <h1 className="text-4xl font-bold font-display text-foreground">
            Laboratory Services
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            NABL-accredited labs with precision diagnostics. Home sample
            collection available across Pune, Mumbai, and Nashik.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            {[
              {
                icon: FlaskConical,
                label: "NABL Accredited",
                sub: "Quality assured",
              },
              { icon: Star, label: "Report Online", sub: "Within 24 hours" },
              { icon: Home, label: "Home Collection", sub: "Free above ₹999" },
              {
                icon: Truck,
                label: "Fast Turnaround",
                sub: "Same-day results",
              },
            ].map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2.5"
              >
                <Icon className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {label}
                  </p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Test catalogue */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <h2 className="text-2xl font-bold font-display">Available Tests</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-smooth ${activeCategory === cat ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card hover:bg-muted"}`}
                data-ocid="lab-category-filter"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {filtered.map((test) => (
            <Card
              key={test.id}
              className="card-elevated hover:shadow-hospital-lg transition-smooth"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                    <FlaskConical className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-[10px] capitalize">
                    {test.category}
                  </Badge>
                </div>
                <h3 className="font-bold font-display text-foreground mb-1">
                  {test.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  {test.desc}
                </p>
                <div className="flex items-center justify-between text-sm border-t border-border pt-3">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{test.time}</span>
                  </div>
                  <span className="font-bold text-primary">₹{test.price}</span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="w-full mt-3 btn-primary"
                  onClick={() => {
                    toast.success(`${test.name} added to cart`);
                  }}
                  data-ocid="book-test-btn"
                >
                  Book Test
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Home collection section */}
        <div className="bg-muted/30 rounded-2xl border border-border overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-accent/15 flex items-center justify-center">
                  <Home className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-display">
                    Home Sample Collection
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Book a phlebotomist at your doorstep
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  {
                    icon: Home,
                    title: "No Travel Required",
                    desc: "Our phlebotomist comes to you between 6–8 AM",
                  },
                  {
                    icon: Star,
                    title: "Reports Online",
                    desc: "Download your reports from the patient portal",
                  },
                  {
                    icon: Truck,
                    title: "Free Collection",
                    desc: "No extra charge for orders above ₹999",
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{title}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 md:p-10">
              <h3 className="text-xl font-bold font-display mb-5">
                Book Home Collection
              </h3>
              <form onSubmit={handleHomeCollection} className="space-y-4">
                <div>
                  <Label htmlFor="lab-address">Pickup Address</Label>
                  <Input
                    id="lab-address"
                    placeholder="Flat no., building, street, city"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1"
                    data-ocid="lab-address-input"
                  />
                </div>
                <div>
                  <Label htmlFor="lab-date">Preferred Date</Label>
                  <Input
                    id="lab-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1"
                    data-ocid="lab-date-input"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Select Tests</Label>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                    {LAB_TESTS.map((test) => (
                      <div key={test.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`test-${test.id}`}
                          checked={selectedTests.includes(test.id)}
                          onCheckedChange={() => toggleTest(test.id)}
                          data-ocid="lab-test-checkbox"
                        />
                        <label
                          htmlFor={`test-${test.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {test.name}
                          <span className="text-muted-foreground ml-1">
                            ₹{test.price}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                {selectedTests.length > 0 && (
                  <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                    <p className="text-sm font-semibold text-primary">
                      Total: ₹
                      {LAB_TESTS.filter((t) =>
                        selectedTests.includes(t.id),
                      ).reduce((s, t) => s + t.price, 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedTests.length} test(s) selected
                    </p>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full btn-accent font-semibold"
                  data-ocid="lab-book-collection-btn"
                >
                  Book Home Collection
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
