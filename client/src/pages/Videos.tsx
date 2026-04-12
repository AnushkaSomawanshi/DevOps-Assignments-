import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Filter, Play, PlayCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const VIDEOS = [
  {
    id: "v1",
    title: "Understanding PCOS: Causes, Symptoms & Treatment",
    duration: "12:45",
    category: "PCOS",
    doctor: "Dr. Anjali Kulkarni",
    views: "48.2K",
    thumbnail: "from-primary/30 to-primary/10",
  },
  {
    id: "v2",
    title: "Your Pregnancy Journey: Week-by-Week Guide (1–12 Weeks)",
    duration: "18:30",
    category: "Pregnancy",
    doctor: "Dr. Priya Sharma",
    views: "62.8K",
    thumbnail: "from-accent/30 to-accent/10",
  },
  {
    id: "v3",
    title: "IVF Treatment: What to Expect at Every Stage",
    duration: "15:20",
    category: "IVF",
    doctor: "Dr. Anjali Kulkarni",
    views: "35.1K",
    thumbnail: "from-primary/30 to-accent/10",
  },
  {
    id: "v4",
    title: "Managing Menopause: Hormonal Changes & Natural Remedies",
    duration: "10:15",
    category: "Menopause",
    doctor: "Dr. Priya Sharma",
    views: "22.4K",
    thumbnail: "from-accent/20 to-primary/20",
  },
  {
    id: "v5",
    title: "Cervical Cancer Prevention & HPV Vaccination Guide",
    duration: "8:50",
    category: "Cancer Prevention",
    doctor: "Dr. Sunita Patil",
    views: "41.7K",
    thumbnail: "from-primary/20 to-accent/20",
  },
  {
    id: "v6",
    title: "Nutrition During Pregnancy: What to Eat & What to Avoid",
    duration: "14:00",
    category: "Nutrition",
    doctor: "Dr. Meera Joshi",
    views: "29.5K",
    thumbnail: "from-accent/30 to-primary/10",
  },
  {
    id: "v7",
    title: "Endometriosis: Diagnosis, Pain Management & Fertility",
    duration: "16:40",
    category: "PCOS",
    doctor: "Dr. Anjali Kulkarni",
    views: "18.3K",
    thumbnail: "from-primary/25 to-accent/15",
  },
  {
    id: "v8",
    title: "High-Risk Pregnancy: Warning Signs You Must Know",
    duration: "11:00",
    category: "Pregnancy",
    doctor: "Dr. Sunita Patil",
    views: "55.6K",
    thumbnail: "from-accent/25 to-primary/25",
  },
  {
    id: "v9",
    title: "Breastfeeding Basics: Latching, Positions & Nutrition",
    duration: "9:30",
    category: "Maternal Care",
    doctor: "Dr. Priya Sharma",
    views: "31.2K",
    thumbnail: "from-primary/30 to-primary/10",
  },
  {
    id: "v10",
    title: "IVF Success Rates: Realistic Expectations & Lifestyle Tips",
    duration: "13:20",
    category: "IVF",
    doctor: "Dr. Anjali Kulkarni",
    views: "27.8K",
    thumbnail: "from-accent/30 to-accent/10",
  },
];

const CATEGORIES = [
  "All",
  "Pregnancy",
  "PCOS",
  "IVF",
  "Nutrition",
  "Maternal Care",
  "Menopause",
  "Cancer Prevention",
];

export default function VideosPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? VIDEOS
      : VIDEOS.filter((v) => v.category === activeCategory);

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-muted/40 py-10 border-b border-border">
        <div className="container mx-auto px-4">
          <Badge variant="secondary" className="mb-3">
            Health Education
          </Badge>
          <h1 className="text-4xl font-bold font-display text-foreground">
            Health Awareness Videos
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Expert-created educational videos on women's health — pregnancy,
            PCOS, IVF, nutrition, and more.
          </p>
          <div className="flex flex-wrap gap-4 mt-5">
            <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2">
              <Play className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">100+ Videos</span>
            </div>
            <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2">
              <Eye className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold">5M+ Total Views</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-smooth ${activeCategory === cat ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card hover:bg-muted"}`}
              data-ocid="video-category-filter"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((video) => (
            <Card
              key={video.id}
              className="card-elevated hover:shadow-hospital-lg transition-smooth group overflow-hidden cursor-pointer"
              onClick={() => toast.info(`Playing: ${video.title}`)}
              data-ocid={`video-card-${video.id}`}
            >
              {/* Thumbnail */}
              <div
                className={`relative h-44 bg-gradient-to-br ${video.thumbnail} flex items-center justify-center overflow-hidden`}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background/80 group-hover:bg-primary/90 group-hover:text-primary-foreground transition-smooth">
                  <PlayCircle className="h-10 w-10 text-primary group-hover:text-white transition-smooth" />
                </div>
                <span className="absolute bottom-2 right-2 bg-foreground/75 text-card text-xs px-1.5 py-0.5 rounded font-mono">
                  {video.duration}
                </span>
                <span className="absolute top-2 left-2 flex items-center gap-1 bg-background/80 text-foreground text-[10px] px-1.5 py-0.5 rounded">
                  <Eye className="h-3 w-3" />
                  {video.views}
                </span>
              </div>
              {/* Info */}
              <CardContent className="p-4">
                <Badge variant="secondary" className="text-[10px] mb-2">
                  {video.category}
                </Badge>
                <h3 className="font-semibold text-foreground text-sm leading-snug mb-2 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-xs text-muted-foreground">{video.doctor}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Playlist CTA */}
        <div className="mt-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-border p-8 text-center">
          <Play className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-display mb-2">
            Want More Health Content?
          </h2>
          <p className="text-muted-foreground mb-5">
            Subscribe to our YouTube channel for weekly expert health videos on
            women's wellness.
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-smooth"
            onClick={() => toast.info("Redirecting to YouTube channel...")}
            data-ocid="subscribe-youtube-btn"
          >
            <PlayCircle className="h-5 w-5" />
            Subscribe on YouTube
          </button>
        </div>
      </div>
    </Layout>
  );
}
