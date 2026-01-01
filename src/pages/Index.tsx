import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { HighlightsSection } from "@/components/home/HighlightsSection";
import { FeaturedCaseStudies } from "@/components/home/FeaturedCaseStudies";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <HighlightsSection />
      <FeaturedCaseStudies />
      <CTASection />
    </Layout>
  );
};

export default Index;
