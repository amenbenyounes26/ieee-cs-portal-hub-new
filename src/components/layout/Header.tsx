import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Calendar, Users, Zap, BookOpen, UserCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/workshops", label: "Workshops", icon: BookOpen },
  { href: "/bootcamps", label: "Bootcamps", icon: Zap },
  { href: "/board", label: "Board", icon: UserCheck },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { data: settings } = useSiteSettings();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass glass-border">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/ieee-cs-logo.png" alt="IEEE CS TEK-UP Logo" className="h-16 w-auto transition-all duration-300 hover:scale-110 hover:drop-shadow-2xl hover:brightness-110" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors relative flex items-center gap-1",
                location.pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.icon && <link.icon className="w-4 h-4" />}
              {link.label}
              {location.pathname === link.href && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <Button asChild size="sm" className="glow-primary">
            <Link to="/join">
              Join IEEE
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass glass-border border-t-0"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3",
                    location.pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.icon && <link.icon className="w-5 h-5" />}
                  <div>
                    <div>{link.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{link.description}</div>
                  </div>
                </Link>
              ))}
              {settings?.header_cta_text && settings?.header_cta_url && (
                <Button asChild className="mt-2 glow-primary">
                  <a href={settings.header_cta_url} target="_blank" rel="noopener noreferrer">
                    {settings.header_cta_text}
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
