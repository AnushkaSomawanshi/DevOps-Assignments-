import { Layout } from "@/components/layout/Layout";
import { BlogCard } from "@/components/ui/BlogCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBlogs } from "@/hooks/useCatalog";
import type { Blog } from "@/types";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Search, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const STATIC_EXTRA_BLOGS: Blog[] = [
  {
    id: "b5",
    title: "Menstrual Health 101: When to See a Doctor for Irregular Periods",
    excerpt:
      "Irregular menstrual cycles can indicate hormonal imbalances, PCOS, thyroid disorders, or other conditions. Understand the red flags and when to seek medical help.",
    content: "",
    category: "Menstrual Health",
    author: "Dr. Meera Joshi",
    authorRole: "Maternal-Fetal Medicine Specialist",
    imageUrl: "/assets/generated/hero-gynecology.dim_1400x600.jpg",
    publishedAt: "2026-03-10",
    readTime: 7,
    tags: ["Menstrual Health", "Hormones", "PCOS", "Thyroid"],
  },
  {
    id: "b6",
    title: "Endometriosis: The Silent Condition Affecting 1 in 10 Indian Women",
    excerpt:
      "Endometriosis is frequently misdiagnosed as 'painful periods.' Learn the signs, diagnosis process, and treatment options available at GyneCare.",
    content: "",
    category: "Gynecology",
    author: "Dr. Priya Sharma",
    authorRole: "Senior Obstetrician",
    imageUrl: "/assets/generated/hero-gynecology.dim_1400x600.jpg",
    publishedAt: "2026-02-20",
    readTime: 9,
    tags: ["Endometriosis", "Pelvic Pain", "Laparoscopy"],
  },
  {
    id: "b7",
    title: "Postnatal Care: The Essential Guide for New Mothers in India",
    excerpt:
      "The first 6 weeks after delivery are critical for recovery. Our obstetricians share evidence-based postnatal care tips, from wound care to mental health support.",
    content: "",
    category: "Maternal Care",
    author: "Dr. Priya Sharma",
    authorRole: "Senior Obstetrician",
    imageUrl: "/assets/generated/hero-gynecology.dim_1400x600.jpg",
    publishedAt: "2026-01-15",
    readTime: 11,
    tags: ["Postnatal", "Maternal Health", "New Mothers"],
  },
  {
    id: "b8",
    title: "Menopause and You: Managing Symptoms Naturally and with HRT",
    excerpt:
      "Menopause doesn't have to be debilitating. From hormone replacement therapy to lifestyle changes, explore science-backed strategies for a smooth transition.",
    content: "",
    category: "Menopause",
    author: "Dr. Sunita Patil",
    authorRole: "Gynecologic Oncologist",
    imageUrl: "/assets/generated/hero-gynecology.dim_1400x600.jpg",
    publishedAt: "2026-01-05",
    readTime: 8,
    tags: ["Menopause", "HRT", "Hormones", "Wellness"],
  },
  {
    id: "b9",
    title:
      "Prenatal Nutrition: A Comprehensive Diet Guide for Indian Pregnant Women",
    excerpt:
      "Proper nutrition during pregnancy is vital for both mother and baby. Our dietitians and obstetricians provide a comprehensive guide tailored for Indian dietary habits.",
    content: "",
    category: "Pregnancy",
    author: "Dr. Meera Joshi",
    authorRole: "Maternal-Fetal Medicine Specialist",
    imageUrl: "/assets/generated/hero-gynecology.dim_1400x600.jpg",
    publishedAt: "2025-12-12",
    readTime: 10,
    tags: ["Prenatal Nutrition", "Pregnancy Diet", "Vitamins"],
  },
  {
    id: "b10",
    title: "HPV Vaccine for Girls: Age, Schedule, and Why It Matters",
    excerpt:
      "HPV vaccination can prevent up to 90% of cervical cancers. Understand the recommended schedule, safety profile, and why every girl in India should be vaccinated.",
    content: "",
    category: "Cancer Prevention",
    author: "Dr. Sunita Patil",
    authorRole: "Gynecologic Oncologist",
    imageUrl: "/assets/generated/hero-gynecology.dim_1400x600.jpg",
    publishedAt: "2025-11-20",
    readTime: 6,
    tags: ["HPV", "Cervical Cancer", "Vaccination", "Prevention"],
  },
];

const CATEGORIES = [
  "All",
  "Pregnancy",
  "PCOS",
  "Fertility",
  "Cancer Prevention",
  "Maternal Care",
  "Menstrual Health",
  "Menopause",
  "Gynecology",
];

export default function BlogsPage() {
  const { data: blogs = [] } = useBlogs();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const EXTENDED_BLOGS: Blog[] = [...blogs, ...STATIC_EXTRA_BLOGS];

  const featuredBlog = EXTENDED_BLOGS[1]; // Pregnancy blog as featured

  const filtered = EXTENDED_BLOGS.filter((b) => {
    const matchCat =
      activeCategory === "All" ||
      b.category.includes(activeCategory) ||
      b.tags.includes(activeCategory);
    const matchSearch =
      !search || b.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Exclude featured from grid when no filters active
  const gridBlogs =
    activeCategory === "All" && !search
      ? filtered.filter((b) => b.id !== featuredBlog.id)
      : filtered;

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
              Health Insights
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-3">
              Women's Health Blogs
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Expert articles by our specialist doctors — covering pregnancy,
              fertility, cancer prevention, and all aspects of women's wellness.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Blog */}
      {activeCategory === "All" && !search && (
        <section className="container mx-auto px-4 pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Featured Article
            </p>
            <Link to="/blogs/$id" params={{ id: featuredBlog.id }}>
              <div className="group rounded-2xl overflow-hidden border border-border hover:shadow-hospital-lg transition-smooth bg-card flex flex-col md:flex-row">
                <div className="md:w-1/2 h-64 md:h-auto overflow-hidden bg-muted relative">
                  <img
                    src={featuredBlog.imageUrl}
                    alt={featuredBlog.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-smooth duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-card text-foreground shadow-hospital">
                      {featuredBlog.category}
                    </Badge>
                  </div>
                </div>
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                  <Badge variant="secondary" className="text-xs mb-3 w-fit">
                    Featured
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground mb-4 group-hover:text-primary transition-smooth leading-tight">
                    {featuredBlog.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {featuredBlog.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-primary" />
                      {featuredBlog.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      {featuredBlog.readTime} min read
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-smooth">
                    Read Full Article <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </section>
      )}

      {/* Filter Bar */}
      <section className="container mx-auto px-4 pt-10">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-smooth ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70 text-muted-foreground"}`}
                data-ocid={`blog-category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="blog-search"
            />
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="container mx-auto px-4 pb-16">
        {gridBlogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No articles found for your search.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => {
                setActiveCategory("All");
                setSearch("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gridBlogs.map((blog, i) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="h-full"
              >
                <BlogCard blog={blog} className="h-full" />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
