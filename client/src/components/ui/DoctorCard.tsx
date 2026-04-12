import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Doctor } from "@/types";
import { Link } from "@tanstack/react-router";
import { Award, Clock, Languages, MapPin, Star } from "lucide-react";

interface DoctorCardProps {
  doctor: Doctor;
  variant?: "default" | "compact" | "featured";
  className?: string;
}

export function DoctorCard({
  doctor,
  variant = "default",
  className,
}: DoctorCardProps) {
  if (variant === "compact") {
    return (
      <Card
        className={cn(
          "card-elevated hover:shadow-hospital-lg transition-smooth group",
          className,
        )}
      >
        <CardContent className="p-4 flex items-center gap-4">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-muted">
            <img
              src={doctor.imageUrl}
              alt={`Dr. ${doctor.name}`}
              className="h-full w-full object-cover group-hover:scale-105 transition-smooth"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/assets/images/placeholder.svg";
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground truncate">
              {doctor.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {doctor.speciality}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{doctor.rating}</span>
              <span className="text-xs text-muted-foreground">
                ({doctor.reviewCount})
              </span>
            </div>
          </div>
          <Link to="/book-appointment">
            <Button
              size="sm"
              variant="outline"
              className="flex-shrink-0 text-xs"
            >
              Book
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (variant === "featured") {
    return (
      <Card
        className={cn(
          "card-elevated hover:shadow-hospital-lg transition-smooth group overflow-hidden",
          className,
        )}
      >
        <div className="relative h-56 overflow-hidden bg-muted">
          <img
            src={doctor.imageUrl}
            alt={`Dr. ${doctor.name}`}
            className="h-full w-full object-cover group-hover:scale-105 transition-smooth duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/assets/images/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <Badge className="bg-accent text-accent-foreground text-xs mb-1">
              {doctor.speciality}
            </Badge>
            <h3 className="text-white font-bold font-display text-lg leading-tight">
              {doctor.name}
            </h3>
            <p className="text-white/80 text-xs">{doctor.qualification}</p>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-sm">{doctor.rating}</span>
              <span className="text-xs text-muted-foreground">
                ({doctor.reviewCount} reviews)
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Award className="h-3 w-3" />
              <span>{doctor.experience} yrs exp.</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <MapPin className="h-3 w-3 flex-shrink-0 text-primary" />
            <span className="truncate">{doctor.hospitalName}</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {doctor.expertise.slice(0, 2).map((exp) => (
              <Badge
                key={exp}
                variant="secondary"
                className="text-[10px] px-2 py-0"
              >
                {exp}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Link to="/find-doctor" className="flex-1">
              <Button variant="outline" size="sm" className="w-full text-xs">
                View Profile
              </Button>
            </Link>
            <Link to="/book-appointment" className="flex-1">
              <Button
                size="sm"
                className="w-full text-xs bg-primary hover:bg-primary/90"
              >
                Book Now
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card
      className={cn(
        "card-elevated hover:shadow-hospital-lg transition-smooth group",
        className,
      )}
      data-ocid="doctor-card"
    >
      <CardContent className="p-0">
        <div className="relative h-48 overflow-hidden rounded-t-lg bg-muted">
          <img
            src={doctor.imageUrl}
            alt={`Dr. ${doctor.name}`}
            className="h-full w-full object-cover group-hover:scale-105 transition-smooth duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/assets/images/placeholder.svg";
            }}
          />
          <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs shadow-hospital">
            {doctor.speciality.split(" ")[0]}
          </Badge>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-foreground font-display mb-0.5">
            {doctor.name}
          </h3>
          <p className="text-xs text-muted-foreground mb-1">
            {doctor.qualification}
          </p>
          <p className="text-sm text-primary font-medium mb-3">
            {doctor.speciality}
          </p>

          <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">
                {doctor.rating}
              </span>
              <span>({doctor.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-primary" />
              <span>{doctor.experience} yrs exp.</span>
            </div>
            <div className="flex items-center gap-1 col-span-2">
              <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
              <span className="truncate">{doctor.location}</span>
            </div>
            <div className="flex items-center gap-1 col-span-2">
              <Languages className="h-3 w-3 text-primary flex-shrink-0" />
              <span className="truncate">{doctor.languages.join(", ")}</span>
            </div>
          </div>

          <div className="text-xs font-semibold text-foreground mb-3">
            Key Expertise:
            <div className="flex flex-wrap gap-1 mt-1">
              {doctor.expertise.slice(0, 3).map((exp) => (
                <Badge
                  key={exp}
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0"
                >
                  {exp}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <span className="text-xs text-muted-foreground">
                Consultation
              </span>
              <p className="text-sm font-bold text-foreground">
                ₹{doctor.consultationFee}
              </p>
            </div>
            <Link to="/book-appointment" data-ocid="doctor-card-book-btn">
              <Button size="sm" className="btn-primary text-xs">
                View Profile
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DoctorCard;
