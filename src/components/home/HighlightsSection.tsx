import { Rocket, TrendingUp, Brain, Users } from "lucide-react";

const highlights = [
  {
    icon: Rocket,
    title: "0-to-1 Product Launches",
    description: "Led EstimateXpress from concept to market, onboarding 500+ shops in Year 1",
  },
  {
    icon: TrendingUp,
    title: "Growth & Optimization",
    description: "Drove 51% conversion increase through funnel optimization at INWEGO",
  },
  {
    icon: Brain,
    title: "AI/ML Exploration",
    description: "Building prototypes and diving deep into machine learning applications",
  },
  {
    icon: Users,
    title: "Cross-Functional Leadership",
    description: "Experience leading teams across engineering, design, and stakeholders",
  },
];

export function HighlightsSection() {
  return (
    <section id="highlights" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            What I <span className="text-gradient">Bring</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A blend of strategic thinking, technical acumen, and hands-on execution
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, index) => (
            <div
              key={item.title}
              className="group p-6 rounded-xl bg-card border border-border card-hover"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 group-hover:animate-pulse-glow transition-all">
                <item.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2 text-foreground">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
