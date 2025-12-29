import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { HighlightsSection } from "@/components/home/HighlightsSection";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { LatestPosts } from "@/components/home/LatestPosts";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <HighlightsSection />
      <FeaturedProjects />
      <LatestPosts />
      <CTASection />
    </Layout>
  );
};

export default Index;
