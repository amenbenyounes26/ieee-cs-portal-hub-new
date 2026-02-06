import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar, MapPin, Clock, ExternalLink, ArrowLeft } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useContentItem, ContentKind } from "@/hooks/use-content-items";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface ContentDetailPageProps {
  kind: ContentKind;
  backLink: string;
  backLabel: string;
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

export function ContentDetailPage({ kind, backLink, backLabel }: ContentDetailPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const { data: item, isLoading, error } = useContentItem(kind, slug || "");

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto animate-pulse">
              <div className="h-8 bg-muted rounded w-1/4 mb-4" />
              <div className="h-12 bg-muted rounded w-3/4 mb-6" />
              <div className="aspect-video bg-muted rounded-xl mb-8" />
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="h-4 bg-muted rounded w-4/6" />
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (error || !item) {
    return (
      <PublicLayout>
        <div className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {kindLabels[kind]} Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              The {kind} you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to={backLink}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {backLabel}
              </Link>
            </Button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <article className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Back Link */}
            <Link
              to={backLink}
              className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {backLabel}
            </Link>

            {/* Header */}
            <div className="mb-8">
              <Badge
                variant="outline"
                className={cn("mb-4", kindColors[item.kind])}
              >
                {kindLabels[item.kind]}
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                {item.title}
              </h1>
              {item.excerpt && (
                <p className="text-xl text-muted-foreground">
                  {item.excerpt}
                </p>
              )}
            </div>

            {/* Cover Image */}
            {item.cover_image_url && (
              <div className="aspect-video rounded-xl overflow-hidden mb-8">
                <img
                  src={item.cover_image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap gap-6 p-6 bg-card rounded-xl border border-border mb-8">
              {item.start_at && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Date</div>
                    <div className="font-medium text-foreground">
                      {format(new Date(item.start_at), "MMMM d, yyyy")}
                    </div>
                  </div>
                </div>
              )}
              {item.start_at && item.end_at && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Time</div>
                    <div className="font-medium text-foreground">
                      {format(new Date(item.start_at), "h:mm a")} -{" "}
                      {format(new Date(item.end_at), "h:mm a")}
                    </div>
                  </div>
                </div>
              )}
              {item.location && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Location</div>
                    <div className="font-medium text-foreground">
                      {item.location}
                    </div>
                  </div>
                </div>
              )}
              {item.format && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{item.format}</Badge>
                </div>
              )}
            </div>

            {/* Registration Button */}
            {item.registration_url && (
              <div className="mb-8">
                <Button asChild size="lg" className="w-full sm:w-auto glow-primary">
                  <a
                    href={item.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Register Now
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            )}

            {/* Content */}
            {item.description_md && (
              <div className="prose-dark max-w-none">
                <ReactMarkdown>{item.description_md}</ReactMarkdown>
              </div>
            )}
          </motion.div>
        </div>
      </article>
    </PublicLayout>
  );
}
