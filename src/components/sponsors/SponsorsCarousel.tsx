import { useSponsors } from "@/hooks/use-sponsors";
import { motion } from "framer-motion";

export function SponsorsCarousel() {
  const { data: sponsors, isLoading } = useSponsors();

  // Placeholder sponsors for demonstration
  const placeholderSponsors = [
    { id: '1', name: 'TechCorp', logo_url: null, website_url: '#', order_index: 1, is_active: true, created_at: '', updated_at: '' },
    { id: '2', name: 'InnovateLab', logo_url: null, website_url: '#', order_index: 2, is_active: true, created_at: '', updated_at: '' },
    { id: '3', name: 'FutureTech', logo_url: null, website_url: '#', order_index: 3, is_active: true, created_at: '', updated_at: '' },
    { id: '4', name: 'CodeMasters', logo_url: null, website_url: '#', order_index: 4, is_active: true, created_at: '', updated_at: '' },
    { id: '5', name: 'DataFlow', logo_url: null, website_url: '#', order_index: 5, is_active: true, created_at: '', updated_at: '' },
    { id: '6', name: 'CloudNine', logo_url: null, website_url: '#', order_index: 6, is_active: true, created_at: '', updated_at: '' },
  ];

  const displaySponsors = sponsors?.length ? sponsors : placeholderSponsors;

  if (isLoading) return null;

  // Duplicate sponsors for seamless infinite scroll (6 times for truly infinite effect)
  const duplicatedSponsors = [
    ...displaySponsors,
    ...displaySponsors,
    ...displaySponsors,
    ...displaySponsors,
    ...displaySponsors,
    ...displaySponsors,
  ];

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-background via-card/20 to-background">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />

      {/* Fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

      <div className="container mx-auto px-4 relative z-20">
        {/* Clean section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Sponsors
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Proudly supported by industry leaders and partners who share our vision of advancing technology for humanity
          </p>
        </motion.div>

        {/* Infinite carousel container */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-8"
            animate={{
              x: "-50%",
            }}
            transition={{
              x: {
                duration: 30,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
              },
            }}
            style={{
              width: "200%",
            }}
          >
            {duplicatedSponsors.map((sponsor, index) => (
              <motion.a
                key={`${sponsor.id}-${index}`}
                href={sponsor.website_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="w-48 h-24 bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center p-4 group-hover:bg-card/90 group-hover:border-primary/20">
                  {sponsor.logo_url ? (
                    <img
                      src={sponsor.logo_url}
                      alt={sponsor.name}
                      className="max-h-full max-w-full object-contain transition-all duration-500"
                    />
                  ) : (
                    <div className="text-muted-foreground font-medium text-center text-sm group-hover:text-primary transition-colors duration-300">
                      {sponsor.name}
                    </div>
                  )}
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Mobile swipe indicator */}
        <div className="md:hidden text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Swipe to explore our sponsors
          </p>
        </div>
      </div>

      {/* Smooth transition to footer */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-card/50" />
    </section>
  );
}
