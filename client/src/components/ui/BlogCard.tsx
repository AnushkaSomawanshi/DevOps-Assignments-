import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDate, truncateText } from "@/lib/utils";
import type { Blog } from "@/types";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Tag, User } from "lucide-react";

interface BlogCardProps {
  blog: Blog;
  variant?: "default" | "horizontal" | "minimal";
  className?: string;
}

export function BlogCard({
  blog,
  variant = "default",
  className,
}: BlogCardProps) {
  if (variant === "horizontal") {
    return (
      <Card
        className={cn(
          "card-elevated hover:shadow-hospital-lg transition-smooth group overflow-hidden",
          className,
        )}
      >
        <div className="flex flex-col sm:flex-row">
          <div className="relative h-48 sm:h-auto sm:w-48 flex-shrink-0 overflow-hidden bg-muted">
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-smooth duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/assets/images/placeholder.svg";
              }}
            />
          </div>
          <CardContent className="p-5 flex flex-col justify-between flex-1">
            <div>
              <Badge variant="secondary" className="text-[10px] mb-2">
                {blog.category}
              </Badge>
              <h3 className="font-bold text-foreground font-display text-lg mb-2 line-clamp-2 group-hover:text-primary transition-smooth">
                {blog.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {blog.excerpt}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3 text-primary" />
                  {blog.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-primary" />
                  {blog.readTime} min read
                </span>
              </div>
              <Link
                to="/blogs/$id"
                params={{ id: blog.id }}
                data-ocid="blog-card-read-btn"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary text-xs gap-1"
                >
                  Read More <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  if (variant === "minimal") {
    return (
      <div
        className={cn("flex items-start gap-3 group cursor-pointer", className)}
      >
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-smooth"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/assets/images/placeholder.svg";
            }}
          />
        </div>
        <div className="min-w-0">
          <Link to="/blogs/$id" params={{ id: blog.id }}>
            <p className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-smooth">
              {blog.title}
            </p>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDate(blog.publishedAt)} · {blog.readTime} min
          </p>
        </div>
      </div>
    );
  }

  // Default card
  return (
    <Card
      className={cn(
        "card-elevated hover:shadow-hospital-lg transition-smooth group overflow-hidden h-full flex flex-col",
        className,
      )}
      data-ocid="blog-card"
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-smooth duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/assets/images/placeholder.svg";
          }}
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-card text-foreground text-[10px] px-2 shadow-hospital">
            <Tag className="h-2.5 w-2.5 mr-1 text-primary" />
            {blog.category}
          </Badge>
        </div>
      </div>

      <CardContent className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-foreground font-display text-base mb-2 line-clamp-2 group-hover:text-primary transition-smooth leading-snug">
          {blog.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">
          {truncateText(blog.excerpt, 120)}
        </p>

        <div className="mt-auto">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3 text-primary" />
              <span className="truncate max-w-[80px]">{blog.author}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-primary" />
              {blog.readTime} min read
            </span>
            <span className="ml-auto">{formatDate(blog.publishedAt)}</span>
          </div>

          <Link
            to="/blogs/$id"
            params={{ id: blog.id }}
            data-ocid="blog-card-read-btn"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 text-xs group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-smooth"
            >
              Read Article <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default BlogCard;
