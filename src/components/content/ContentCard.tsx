import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { ContentItem } from "@/hooks/use-content-items";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  item: ContentItem;
}

const kindColors = {
  event: "bg-primary/10 text-primary border-primary/20",
  workshop: "bg-info/10 text-info border-info/20",
  bootcamp: "bg-success/10 text-success border-success/20",
};

const kindLabels = {
  event: "Event",
  workshop: "Workshop",
  bootcamp: "Bootcamp",
};

export function ContentCard({ item }: ContentCardProps) {
  const href = `/${item.kind}s/${item.slug}`;

  return (
    <Link
      to={href}
      className="group block bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Cover Image */}
      <div className="aspect-video relative overflow-hidden bg-muted">
        {item.cover_image_url ? (
          <img
            src={item.cover_image_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-12 h-12 text-muted-foreground/50" />
          </div>
        )}
        <Badge
          variant="outline"
          className={cn("absolute top-3 left-3", kindColors[item.kind])}
        >
          {kindLabels[item.kind]}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h3 className="font-semibold text-foreground text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {item.title}
        </h3>

        {item.excerpt && (
          <p className="text-muted-foreground text-sm line-clamp-2">
            {item.excerpt}
          </p>
        )}

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {item.start_at && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{format(new Date(item.start_at), "MMM d, yyyy")}</span>
            </div>
          )}
          {item.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="truncate max-w-[120px]">{item.location}</span>
            </div>
          )}
        </div>

        <div className="flex items-center text-primary text-sm font-medium pt-2">
          Learn More
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
