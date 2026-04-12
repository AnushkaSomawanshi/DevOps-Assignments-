import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import type { HealthPackage } from "@/types";
import { Link } from "@tanstack/react-router";
import { CheckCircle, FlaskConical, Tag } from "lucide-react";

interface PackageCardProps {
  pkg: HealthPackage;
  variant?: "default" | "compact";
  className?: string;
}

export function PackageCard({
  pkg,
  variant = "default",
  className,
}: PackageCardProps) {
  const discount = Math.round(
    ((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100,
  );

  if (variant === "compact") {
    return (
      <Card
        className={cn(
          "card-elevated hover:shadow-hospital-lg transition-smooth group",
          className,
        )}
      >
        <CardContent className="p-4 flex items-center gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <FlaskConical className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground text-sm truncate">
              {pkg.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {pkg.testCount} tests included
            </p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="font-bold text-foreground text-sm">
              {formatCurrency(pkg.price)}
            </p>
            <Link to="/health-packages">
              <Button size="sm" variant="outline" className="text-xs mt-1">
                Book
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "card-elevated hover:shadow-hospital-lg transition-smooth group relative overflow-hidden",
        pkg.popular && "ring-2 ring-accent ring-offset-2",
        className,
      )}
      data-ocid="package-card"
    >
      {pkg.popular && (
        <div className="absolute top-0 right-0">
          <div className="bg-accent text-accent-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg">
            POPULAR
          </div>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-smooth">
            <FlaskConical className="h-6 w-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <Badge
              variant="secondary"
              className="text-[10px] px-2 py-0 mb-2 flex-shrink-0 w-fit"
            >
              <Tag className="h-2.5 w-2.5 mr-1" />
              {pkg.category}
            </Badge>
            <h3 className="font-bold text-foreground font-display text-base leading-tight line-clamp-2">
              {pkg.name}
            </h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {pkg.description}
        </p>

        <div className="mb-4">
          <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
            <CheckCircle className="h-3.5 w-3.5 text-primary" />
            Included Tests ({pkg.testCount} total):
          </p>
          <div className="space-y-1">
            {pkg.tests.slice(0, 4).map((test) => (
              <div
                key={test}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                {test}
              </div>
            ))}
            {pkg.tests.length > 4 && (
              <p className="text-xs text-primary font-medium">
                +{pkg.tests.length - 4} more tests
              </p>
            )}
          </div>
        </div>

        {pkg.ageGroup && (
          <p className="text-xs text-muted-foreground mb-4">
            <span className="font-medium">Age Group:</span> {pkg.ageGroup}
          </p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                {formatCurrency(pkg.price)}
              </span>
              {discount > 0 && (
                <Badge className="bg-primary/10 text-primary text-[10px] px-1.5 py-0">
                  {discount}% OFF
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground line-through">
              {formatCurrency(pkg.originalPrice)}
            </p>
          </div>
          <Link to="/book-appointment" data-ocid="package-card-book-btn">
            <Button className="btn-accent text-sm font-semibold">
              Book Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default PackageCard;
