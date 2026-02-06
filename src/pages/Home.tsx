import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Users, Zap, Sparkles, BookOpen, UserCheck, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useUpcomingContent, useContentItems } from "@/hooks/use-content-items";
import { useBoardMembers } from "@/hooks/use-board-members";
import { ContentCard } from "@/components/content/ContentCard";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const { data: settings } = useSiteSettings();
  const { data: upcomingEvents } = useUpcomingContent("event", 3);
  const { data: upcomingWorkshops } = useUpcomingContent("workshop", 3);
  const { data: upcomingBootcamps } = useUpcomingContent("bootcamp", 3);
  const { data: events } = useContentItems("event", "published");
  const { data: workshops } = useContentItems("workshop", "published");
  const { data: bootcamps } = useContentItems("bootcamp", "published");
  const { data: boardMembers } = useBoardMembers();

  const allUpcoming = [
    ...(upcomingEvents || []),
    ...(upcomingWorkshops || []),
    ...(upcomingBootcamps || []),
  ]
    .sort((a, b) => new Date(a.start_at!).getTime() - new Date(b.start_at!).getTime())
    .slice(0, 6);

  const sections = [
    {
      title: "Events",
      description: "Discover upcoming events and activities that will help you grow professionally and connect with like-minded individuals in the tech community.",
      icon: Calendar,
      bgColor: "bg-blue-500/20",
      color: "text-blue-500",
      gradient: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
      href: "/events",
      count: events?.length || 0,
      label: "Events",
      featured: "Join our upcoming Tech Conference featuring industry leaders and networking opportunities",
      images: [1, 2, 3, 4]
    },
    {
      title: "Workshops",
      description: "Learn new skills with our hands-on workshops led by industry experts and experienced professionals in cutting-edge technologies.",
      icon: BookOpen,
      bgColor: "bg-green-500/20",
      color: "text-green-500",
      gradient: "bg-gradient-to-br from-green-500/20 to-emerald-500/20",
      href: "/workshops",
      count: workshops?.length || 0,
      label: "Workshops",
      featured: "Master React Development with our intensive 3-day workshop covering modern web technologies",
      images: [1, 2, 3, 4]
    },
    {
      title: "Bootcamps",
      description: "Intensive training programs designed to accelerate your career growth with comprehensive learning paths and practical projects.",
      icon: Zap,
      bgColor: "bg-purple-500/20",
      color: "text-purple-500",
      gradient: "bg-gradient-to-br from-purple-500/20 to-violet-500/20",
      href: "/bootcamps",
      count: bootcamps?.length || 0,
      label: "Bootcamps",
      featured: "Transform your career with our Full-Stack Development Bootcamp - from beginner to job-ready in 12 weeks",
      images: [1, 2, 3, 4]
    },
    {
      title: "Board Members",
      description: "Meet our dedicated team of leaders driving innovation and excellence, committed to advancing technology for humanity.",
      icon: UserCheck,
      bgColor: "bg-orange-500/20",
      color: "text-orange-500",
      gradient: "bg-gradient-to-br from-orange-500/20 to-amber-500/20",
      href: "/board",
      count: boardMembers?.filter(m => m.is_active).length || 0,
      label: "Members",
      featured: "Our executive board consists of experienced professionals leading various committees and initiatives",
      images: [1, 2, 3, 4]
    },
    {
      title: "Contact Us",
      description: "Get in touch with us for inquiries, partnerships, or collaboration opportunities. We're always here to help and connect.",
      icon: Mail,
      bgColor: "bg-red-500/20",
      color: "text-red-500",
      gradient: "bg-gradient-to-br from-red-500/20 to-pink-500/20",
      href: "/contact",
      count: "∞",
      label: "Available",
      featured: "Reach out to us through our contact form, email, or social media channels for any questions or collaborations",
      images: [1, 2, 3, 4]
    }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/20" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">IEEE Computer Society</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-foreground">Welcome to </span>
              <span className="text-gradient">IEEE CS</span>
              <br />
              <span className="text-foreground">TEK-UP SBC</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Empowering students through technology, innovation, and community. 
              Join us to explore, learn, and grow together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="glow-primary">
                <Link to="/events">
                  Explore Events
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Calendar, label: "Events", value: "50+" },
              { icon: Users, label: "Members", value: "200+" },
              { icon: Zap, label: "Workshops", value: "30+" },
              { icon: Sparkles, label: "Projects", value: "20+" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      {settings?.home_intro_md && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto prose-dark"
            >
              <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
                About Us
              </h2>
              <div className="text-muted-foreground leading-relaxed">
                <ReactMarkdown>{settings.home_intro_md}</ReactMarkdown>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Sections Summary */}
      <section className="py-20 bg-gradient-to-br from-background via-card/10 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Explore Our Community</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Discover Your Path to Excellence
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Explore all the ways you can engage with IEEE CS TEK-UP SBC and advance your career in technology
            </p>
          </motion.div>

          {/* Vertical Modern Layout */}
          <div className="space-y-16">
            {sections.map((section, index) => {
              // Special handling for Contact Us section
              if (section.title === "Contact Us") {
                return (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.2,
                      type: "spring",
                      stiffness: 100
                    }}
                    className="relative"
                  >
                    <div className="max-w-4xl mx-auto text-center">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="group"
                      >
                        <Card className="border-0 shadow-2xl bg-card/90 backdrop-blur-sm overflow-hidden group-hover:shadow-3xl transition-all duration-500">
                          {/* Animated Gradient Border */}
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          <CardHeader className="relative pb-6">
                            <div className="flex items-center justify-center gap-4 mb-4">
                              <motion.div
                                className={`w-16 h-16 rounded-2xl ${section.bgColor} flex items-center justify-center shadow-lg`}
                                whileHover={{ rotate: 10, scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <section.icon className={`w-8 h-8 ${section.color}`} />
                              </motion.div>
                              <div>
                                <div className="text-4xl font-bold text-foreground">{section.count}</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wide">{section.label}</div>
                              </div>
                            </div>
                            <CardTitle className="text-4xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                              {section.title}
                            </CardTitle>
                            <CardDescription className="text-xl leading-relaxed text-muted-foreground max-w-2xl mx-auto">
                              {section.description}
                            </CardDescription>
                          </CardHeader>

                          <CardContent className="relative">
                            {/* Featured Content Preview */}
                            <div className="mb-8 p-6 bg-muted/50 rounded-xl border border-border/50 max-w-2xl mx-auto">
                              <h4 className="font-semibold text-foreground mb-3 flex items-center justify-center gap-2 text-lg">
                                <section.icon className={`w-5 h-5 ${section.color}`} />
                                Featured {section.title}
                              </h4>
                              <p className="text-base text-muted-foreground">{section.featured}</p>
                            </div>

                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="max-w-md mx-auto"
                            >
                              <Button
                                asChild
                                size="lg"
                                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group/btn text-lg py-6"
                              >
                                <Link to={section.href} className="flex items-center justify-center gap-2">
                                  <span>Get in Touch</span>
                                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                </Link>
                              </Button>
                            </motion.div>
                          </CardContent>

                          {/* Decorative Elements */}
                          <div className="absolute top-6 right-6 w-4 h-4 bg-primary/30 rounded-full animate-pulse" />
                          <div className="absolute bottom-6 left-6 w-3 h-3 bg-orange-500/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                        </Card>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              }

              // Regular sections with alternating layout
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  className={`relative ${index % 2 === 0 ? '' : 'md:flex-row-reverse'} md:flex md:items-center md:gap-12`}
                >
                  {/* Content Side */}
                  <div className="md:w-1/2 mb-8 md:mb-0">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="group"
                    >
                      <Card className="border-0 shadow-2xl bg-card/90 backdrop-blur-sm overflow-hidden group-hover:shadow-3xl transition-all duration-500">
                        {/* Animated Gradient Border */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <CardHeader className="relative pb-6">
                          <div className="flex items-center gap-4 mb-4">
                            <motion.div
                              className={`w-14 h-14 rounded-2xl ${section.bgColor} flex items-center justify-center shadow-lg`}
                              whileHover={{ rotate: 10, scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              <section.icon className={`w-7 h-7 ${section.color}`} />
                            </motion.div>
                            <div>
                              <div className="text-3xl font-bold text-foreground">{section.count}</div>
                              <div className="text-sm text-muted-foreground uppercase tracking-wide">{section.label}</div>
                            </div>
                          </div>
                          <CardTitle className="text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                            {section.title}
                          </CardTitle>
                          <CardDescription className="text-lg leading-relaxed text-muted-foreground">
                            {section.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="relative">
                          {/* Featured Content Preview */}
                          <div className="mb-6 p-4 bg-muted/50 rounded-xl border border-border/50">
                            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                              <section.icon className={`w-4 h-4 ${section.color}`} />
                              Featured {section.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">{section.featured}</p>
                          </div>

                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              asChild
                              size="lg"
                              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                            >
                              <Link to={section.href} className="flex items-center justify-center gap-2">
                                <span>Explore {section.title}</span>
                                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                              </Link>
                            </Button>
                          </motion.div>
                        </CardContent>

                        {/* Decorative Elements */}
                        <div className="absolute top-4 right-4 w-3 h-3 bg-primary/30 rounded-full animate-pulse" />
                        <div className="absolute bottom-4 left-4 w-2 h-2 bg-orange-500/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                      </Card>
                    </motion.div>
                  </div>

                  {/* Visual Side */}
                  <div className="md:w-1/2">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.3, duration: 0.6 }}
                      className="relative group"
                    >
                      {/* Background Pattern */}
                      <div className={`absolute inset-0 ${section.gradient} rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`} />

                      <div className="relative bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 overflow-hidden">
                        {/* Sample Images Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          {section.images.map((image, imgIndex) => (
                            <motion.div
                              key={imgIndex}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.2 + 0.4 + imgIndex * 0.1 }}
                              className="aspect-square rounded-xl overflow-hidden bg-muted flex items-center justify-center"
                            >
                              <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                                <section.icon className={`w-8 h-8 ${section.color} opacity-50`} />
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Stats Display */}
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Total {section.label.toLowerCase()}</span>
                          <span className="font-semibold text-foreground">{section.count}</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      {allUpcoming.length > 0 && (
        <section className="py-20 bg-card/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Upcoming Activities
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Don't miss out on our latest events, workshops, and bootcamps
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allUpcoming.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ContentCard item={item} />
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild variant="outline" size="lg">
                <Link to="/events">
                  View All Activities
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Stay Updated
            </h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter and never miss an update
            </p>
            <NewsletterForm />
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
