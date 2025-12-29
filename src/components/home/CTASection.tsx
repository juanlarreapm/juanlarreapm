import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Let's Build Something{" "}
            <span className="text-gradient">Amazing</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            I'm actively looking for my next PM role where I can make a meaningful impact. Let's connect and explore opportunities together.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold px-8 hover-glow"
            >
              <Link to="/contact">
                <Mail className="mr-2 w-4 h-4" />
                Get in Touch
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="border-border hover:bg-secondary"
            >
              <a 
                href="https://www.linkedin.com/in/juanlarreapm/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Connect on LinkedIn
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
