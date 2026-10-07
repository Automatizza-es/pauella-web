import HeroSection from "@/components/home/HeroSection";
import ConceptSection from "@/components/home/ConceptSection";
import ExperienceSection from "@/components/home/ExperienceSection";
import MenuSection from "@/components/home/MenuSection";
import ExtrasSection from "@/components/home/ExtrasSection";
import PhotoVideoSection from "@/components/home/PhotoVideoSection";
import LearnToCookSection from "@/components/home/LearnToCookSection";
import AboutPauSection from "@/components/home/AboutPauSection";
import ServiceAreaSection from "@/components/home/ServiceAreaSection";
import FAQSection from "@/components/home/FAQSection";
import ContactSection from "@/components/home/ContactSection";
import { getCateringBusinessSchema } from "@/lib/schema";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getCateringBusinessSchema()) }}
      />
      <HeroSection />
      <ConceptSection />
      <ExperienceSection />
      <MenuSection />
      <ExtrasSection />
      <PhotoVideoSection />
      <LearnToCookSection />
      <AboutPauSection />
      <ServiceAreaSection />
      <FAQSection />
      <ContactSection />
    </>
  );
}
