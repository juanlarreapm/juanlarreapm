import { Link } from "react-router-dom";
import { Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
export function HeroSection() {
  const scrollToHighlights = () => {
    document.getElementById("highlights")?.scrollIntoView({
      behavior: "smooth"
    });
  };
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-pattern">
      {/* Background glow effects with floating animation */}
      <div className="absolute inset-0 bg-gradient-glow opacity-50" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-glow-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-glow-pulse delay-200" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-float-rotate" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Open to new PM opportunities
            </span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up">
            Hi, I'm{" "}
            <span className="text-gradient">Juan Larrea</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-4 animate-fade-in-up delay-200">
            Senior Product Manager with 8+ years building impactful products
          </p>

          {/* Description */}
          <p className="text-lg text-muted-foreground/80 max-w-xl mx-auto mb-10 animate-fade-in-up delay-300">
            From 0-to-1 launches to growth optimization. Currently exploring the frontiers of AI/ML and building prototypes along the way.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-400">
            <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold px-8 hover-glow btn-ripple group">
              <Link to="/about">
                <span className="group-hover:text-shimmer">My Experience</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-border hover:bg-secondary btn-ripple">
              <Link to="/projects">
                View My Work
              </Link>
            </Button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto animate-fade-in-up delay-500">
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-gradient">8+</div>
              <div className="text-sm text-muted-foreground">Years in PM</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-gradient">5+</div>
              <div className="text-sm text-muted-foreground">Industries</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-gradient">B2B</div>
              <div className="text-sm text-muted-foreground">SaaS</div>
            </div>
          </div>
        </div>

      </div>
    </section>;
}