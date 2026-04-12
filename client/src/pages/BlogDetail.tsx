import { Layout } from "@/components/layout/Layout";
import { BlogCard } from "@/components/ui/BlogCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBlogs } from "@/hooks/useCatalog";
import type { Blog } from "@/types";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Facebook,
  Heart,
  Link2,
  Share2,
  Twitter,
  User,
} from "lucide-react";
import { motion } from "motion/react";

const FULL_ARTICLE_CONTENT = `
Pregnancy is a remarkable journey that transforms not just your body but your entire life. At GyneCare, we believe every expectant mother deserves comprehensive, accurate information to navigate this experience with confidence.

## First Trimester (Weeks 1–12)

The first trimester is a time of rapid development. Your baby grows from a single fertilized cell to a recognizable human form with a beating heart by week 6.

**What you'll experience:**
- Nausea (morning sickness) — peaks around weeks 8–10
- Breast tenderness and frequent urination
- Fatigue as your body builds the placenta
- Emotional changes due to hormonal shifts

**Key milestones:**
- Week 6: Heart begins beating (120–160 bpm)
- Week 10: Baby is now technically a fetus
- Week 12: Risk of miscarriage drops significantly

**Important appointments:**
- First prenatal visit (weeks 8–10): Blood tests, Rh factor, STI screening
- NT (Nuchal Translucency) scan: Weeks 11–13 for Down syndrome screening

## Second Trimester (Weeks 13–26)

Most women feel a surge of energy in the second trimester. Nausea eases and you'll feel your baby's first movements — "quickening" — around weeks 18–22.

**Key milestones:**
- Week 16: Baby can make facial expressions
- Week 20: Halfway point — Anatomy scan is done
- Week 24: Baby reaches "viability"
- Week 26: Eyes are fully formed and can open

**Important appointments:**
- Anomaly Scan / Level II Ultrasound: Weeks 18–20
- Glucose Challenge Test (GCT): Screens for gestational diabetes

## Third Trimester (Weeks 27–40)

Your baby is gaining weight rapidly. By week 36, baby is considered "early term."

**Key milestones:**
- Week 28: Baby can hear sounds
- Week 37: "Full term" begins
- Week 40: Estimated due date

## When to Call Your Doctor Immediately

- Heavy vaginal bleeding at any stage
- Severe abdominal pain or cramping
- Reduced fetal movement after week 28
- Signs of preeclampsia: Sudden severe headache, visual changes, sudden swelling
- Fluid leaking from vagina before 37 weeks

## Nutrition Essentials During Pregnancy

Good nutrition is the foundation of a healthy pregnancy:

- **Folic Acid**: 400–800 mcg/day — prevents neural tube defects
- **Iron**: 27 mg/day — prevents anemia (leafy greens, dals)
- **Calcium**: 1,000 mg/day — for baby's bones and teeth
- **Protein**: 70–100 g/day — for baby's growth
- **Omega-3**: For brain development (fish, walnuts, flaxseed)

Avoid raw meat, unpasteurized dairy, excess caffeine, and alcohol entirely.
`;

// Renders inline text with **bold** support, using content as stable key
function InlineText({ text, prefix }: { text: string; prefix: string }) {
  const parts = text.split(/\*\*([^*]+)\*\*/);
  return (
    <>
      {parts.map((part, k) =>
        k % 2 === 1 ? (
          <strong
            key={`${prefix}-b-${part.slice(0, 8)}`}
            className="text-foreground"
          >
            {part}
          </strong>
        ) : (
          <span key={`${prefix}-t-${part.slice(0, 8)}-${k}`}>{part}</span>
        ),
      )}
    </>
  );
}

// Simple content renderer
function ArticleContent({ content }: { content: string }) {
  const paragraphs = content.trim().split("\n\n");
  return (
    <div className="space-y-4">
      {paragraphs.map((para) => {
        const trimmed = para.trim();
        const slug = trimmed.slice(0, 30).replace(/\W/g, "-");
        if (!trimmed) return null;
        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={`h-${slug}`}
              className="text-xl font-bold font-display text-foreground mt-8 mb-3 border-b border-border pb-2"
            >
              {trimmed.slice(3)}
            </h2>
          );
        }
        if (trimmed.includes("\n- ") || trimmed.startsWith("- ")) {
          const lines = trimmed.split("\n");
          const items = lines
            .filter((l) => l.startsWith("- "))
            .map((l) => l.slice(2));
          const header = lines[0];
          const hasHeader = !header.startsWith("- ");
          return (
            <div key={`ul-${slug}`}>
              {hasHeader && (
                <p className="font-semibold text-foreground mb-2">{header}</p>
              )}
              <ul className="space-y-2 pl-4">
                {items.map((item) => {
                  const itemSlug = item.slice(0, 20).replace(/\W/g, "-");
                  return (
                    <li
                      key={`li-${itemSlug}`}
                      className="flex items-start gap-2 text-muted-foreground text-sm"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                      <span>
                        <InlineText text={item} prefix={itemSlug} />
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        }
        return (
          <p
            key={`p-${slug}`}
            className="text-muted-foreground leading-relaxed"
          >
            <InlineText text={trimmed} prefix={slug} />
          </p>
        );
      })}
    </div>
  );
}

const FEATURED_BLOG: Blog = {
  id: "b2",
  title: "Week-by-Week Pregnancy Guide: What to Expect in Each Trimester",
  excerpt:
    "From the first heartbeat to delivery, our comprehensive guide walks you through every stage of your pregnancy journey with expert tips and insights.",
  content: FULL_ARTICLE_CONTENT,
  category: "Pregnancy & Maternity",
  author: "Dr. Priya Sharma",
  authorRole: "Senior Obstetrician, MD DGO FRCOG",
  imageUrl: "/assets/generated/hero-gynecology.dim_1400x600.jpg",
  publishedAt: "2026-03-28",
  readTime: 12,
  tags: ["Pregnancy", "Prenatal Care", "Trimester", "Maternal Health"],
};

export default function BlogDetailPage() {
  const { id } = useParams({ from: "/blogs/$id" });
  const { data: blogs = [] } = useBlogs();
  const found = blogs.find((b) => b.id === id);
  const blog: Blog = found ?? FEATURED_BLOG;

  // Use full article content when available, otherwise fallback
  const displayContent = blog.content?.trim()
    ? blog.content
    : FULL_ARTICLE_CONTENT;
  const relatedBlogs = blogs.filter((b) => b.id !== blog.id).slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
  };

  return (
    <Layout>
      {/* Article Header */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-12 border-b border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" /> Back to All Blogs
            </Link>
            <Badge variant="secondary" className="mb-4">
              {blog.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-6 leading-tight">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-xs">
                    {blog.author}
                  </p>
                  <p className="text-[11px]">{blog.authorRole}</p>
                </div>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                {new Date(blog.publishedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                {blog.readTime} min read
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-primary" />
                {blog.tags.slice(0, 2).join(", ")}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Layout */}
      <section className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Article Body */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-8 bg-muted">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
              </div>

              <p className="text-lg text-muted-foreground border-l-4 border-primary pl-5 mb-8 italic leading-relaxed">
                {blog.excerpt}
              </p>

              <ArticleContent content={displayContent} />

              <div className="mt-10 pt-6 border-t border-border">
                <p className="text-sm font-semibold text-foreground mb-3">
                  Tags:
                </p>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-5 bg-muted/40 rounded-xl">
                <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-primary" /> Share this article
                </p>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() =>
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                        "_blank",
                      )
                    }
                  >
                    <Facebook className="h-3.5 w-3.5" /> Facebook
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`,
                        "_blank",
                      )
                    }
                  >
                    <Twitter className="h-3.5 w-3.5" /> Twitter
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={handleCopyLink}
                  >
                    <Link2 className="h-3.5 w-3.5" /> Copy Link
                  </Button>
                </div>
              </div>

              <div className="mt-8 p-5 bg-primary/5 border border-primary/10 rounded-xl flex items-start gap-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{blog.author}</p>
                  <p className="text-sm text-primary font-medium">
                    {blog.authorRole}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    Expert gynecologist at GyneCare Hospital with over 15 years
                    of clinical experience in women's health. Passionate about
                    evidence-based patient care and women's wellness education.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-primary/10 to-accent/5 rounded-2xl p-6 border border-primary/10"
            >
              <Heart className="h-8 w-8 text-accent mb-3 fill-accent/20" />
              <h3 className="font-bold font-display text-foreground text-lg mb-2">
                Need a Consultation?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Book an appointment with our specialists today.
              </p>
              <Link to="/book-appointment">
                <Button className="w-full bg-primary hover:bg-primary/90 font-semibold gap-2">
                  Book Appointment
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-bold font-display text-foreground text-lg mb-4">
                Related Articles
              </h3>
              <div className="space-y-4">
                {relatedBlogs.map((related) => (
                  <BlogCard key={related.id} blog={related} variant="minimal" />
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-xl border border-border p-5"
            >
              <h3 className="font-bold font-display text-foreground text-base mb-3">
                Browse Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Pregnancy",
                  "PCOS",
                  "Fertility",
                  "Cancer Prevention",
                  "Maternal Care",
                  "Menopause",
                ].map((cat) => (
                  <Link key={cat} to="/blogs">
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-smooth text-xs"
                    >
                      {cat}
                    </Badge>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
