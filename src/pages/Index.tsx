import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { HighlightsSection } from "@/components/home/HighlightsSection";
import { FeaturedCaseStudies } from "@/components/home/FeaturedCaseStudies";
import { LatestPosts } from "@/components/home/LatestPosts";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <HighlightsSection />
      <FeaturedCaseStudies />
      <LatestPosts />
      <CTASection />
    </Layout>
  );
};

export default Index;
