import { prisma } from "@/lib/prisma";
import SiteNav from "@/components/nav/site-nav";
import Hero from "@/components/sections/hero";
import AboutSection from "@/components/sections/about-section";
import ServicesSection from "@/components/sections/services-section";
import PortfolioSection from "@/components/sections/portfolio-section";
import ProcessSection from "@/components/sections/process-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import ContactSection from "@/components/sections/contact-section";
import Footer from "@/components/footer";
import WhatsAppButton from "@/components/whatsapp/whatsapp-button";

export const dynamic = "force-dynamic";

export default async function Home() {
  const gallery = await prisma.galleryItem.findMany({ where: { published: true }, orderBy: { order: "asc" } });

  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <AboutSection />
        <ServicesSection />
        <PortfolioSection items={gallery} />
        <ProcessSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton variant="floating" />
    </>
  );
}
