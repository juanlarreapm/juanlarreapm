import { Rocket, TrendingUp, Hammer, Users } from "lucide-react";

const highlights = [
  {
    icon: Rocket,
    title: "0-to-1 Product Launches",
    description: "Led products from concept to market across multiple industries and company stages",
  },
  {
    icon: TrendingUp,
    title: "Growth & Optimization",
    description: "Data-informed approach to funnel optimization and user engagement improvements",
  },
  {
    icon: Users,
    title: "B2B & B2C Experience",
    description: "Versatile PM experience across enterprise and consumer-facing products",
  },
  {
    icon: Hammer,
    title: "Hands-On Execution",
    description:
      "I have a strong bias for action, building prototypes, shipping scrappy MVPs, and learning in production instead of PowerPoint",
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {highlights.map((item, index) => (
            <div key={item.title} className="group p-6 rounded-xl bg-card border border-border card-hover">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 group-hover:animate-pulse-glow transition-all icon-bounce">
                <item.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
