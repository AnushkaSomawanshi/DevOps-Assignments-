import { Card, CardContent } from "@/components/ui/card";
import { cn, getInitials } from "@/lib/utils";
import type { Testimonial } from "@/types";
import { Quote, Star } from "lucide-react";

interface TestimonialCardProps {
  testimonial: Testimonial;
  variant?: "default" | "featured" | "minimal";
  className?: string;
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, i) => {
        const starKey = `star-rating-${i}`;
        return (
          <Star
            key={starKey}
            className={cn(
              "h-4 w-4",
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted",
            )}
          />
        );
      })}
    </div>
  );
}

export function TestimonialCard({
  testimonial,
  variant = "default",
  className,
}: TestimonialCardProps) {
  if (variant === "minimal") {
    return (
      <div className={cn("flex gap-3 group", className)}>
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
          {testimonial.avatar ? (
            <img
              src={testimonial.avatar}
              alt={testimonial.patientName}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            getInitials(testimonial.patientName)
          )}
        </div>
        <div className="min-w-0">
          <StarRating rating={testimonial.rating} />
          <p className="text-sm text-muted-foreground italic mt-1 line-clamp-2">
            "{testimonial.quote}"
          </p>
          <p className="text-xs font-semibold text-foreground mt-1">
            {testimonial.patientName}
          </p>
        </div>
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <Card
        className={cn(
          "card-elevated border-l-4 border-l-accent shadow-hospital-lg",
          className,
        )}
      >
        <CardContent className="p-6">
          <Quote className="h-8 w-8 text-accent/40 mb-4" />
          <StarRating rating={testimonial.rating} />
          <p className="text-foreground italic leading-relaxed mt-3 mb-5 text-base">
            "{testimonial.quote}"
          </p>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
              {testimonial.avatar ? (
                <img
                  src={testimonial.avatar}
                  alt={testimonial.patientName}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                getInitials(testimonial.patientName)
              )}
            </div>
            <div>
              <p className="font-bold text-foreground font-display">
                {testimonial.patientName}
              </p>
              <p className="text-xs text-muted-foreground">
                {testimonial.patientLocation}
              </p>
              <p className="text-xs text-primary font-medium mt-0.5">
                {testimonial.treatment}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default
  return (
    <Card
      className={cn(
        "card-elevated hover:shadow-hospital-lg transition-smooth group h-full flex flex-col",
        className,
      )}
      data-ocid="testimonial-card"
    >
      <CardContent className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <StarRating rating={testimonial.rating} />
          <Quote className="h-6 w-6 text-accent/30 flex-shrink-0" />
        </div>

        <p className="text-sm text-muted-foreground italic leading-relaxed flex-1 mb-4">
          "{testimonial.quote}"
        </p>

        <div className="flex items-center gap-3 pt-3 border-t border-border mt-auto">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-bold text-sm">
            {testimonial.avatar ? (
              <img
                src={testimonial.avatar}
                alt={testimonial.patientName}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              getInitials(testimonial.patientName)
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground text-sm truncate">
              {testimonial.patientName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {testimonial.patientLocation}
            </p>
            <p className="text-[10px] text-primary font-medium mt-0.5 truncate">
              {testimonial.treatment}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TestimonialCard;
