import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SponsorsCarousel } from "@/components/sponsors/SponsorsCarousel";
import { PageTransition } from "./PageTransition";

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <PageTransition>{children}</PageTransition>
      </main>
      <SponsorsCarousel />
      <Footer />
    </div>
  );
}
