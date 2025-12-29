import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const featuredProjects = [
  {
    title: "EstimateXpress",
    company: "PartsTech",
    description: "Led 0-to-1 launch of an estimating tool that revolutionized how auto repair shops create quotes",
    metrics: ["500+ shops onboarded in Year 1", "First product of its kind in market"],
    tags: ["0-to-1", "B2B SaaS", "Growth"],
    gradient: "from-primary to-accent",
  },
  {
    title: "Jobs Feature",
    company: "PartsTech",
    description: "Designed and launched a job management system that transformed the parts ordering workflow",
    metrics: ["10% cart size increase", "Improved user retention"],
    tags: ["Feature Development", "UX", "Analytics"],
    gradient: "from-accent to-primary",
  },
  {
    title: "Funnel Optimization",
    company: "INWEGO",
    description: "Comprehensive redesign of the conversion funnel for a travel insurance platform",
    metrics: ["51% conversion increase", "Revenue impact"],
    tags: ["Growth", "A/B Testing", "Conversion"],
    gradient: "from-primary via-accent to-primary",
  },
];

export function FeaturedProjects() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-muted-foreground max-w-xl">
              A selection of impactful products I've built and shipped
            </p>
          </div>
          <Button asChild variant="ghost" className="text-primary hover:text-primary/80">
            <Link to="/projects">
              View all projects
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project, index) => (
            <Link
              key={project.title}
              to="/projects"
              className="group block"
            >
              <article className="h-full p-6 rounded-xl bg-card border border-border card-hover overflow-hidden relative">
                {/* Gradient accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${project.gradient}`} />
                
                <div className="mb-4">
                  <span className="text-xs text-primary font-medium uppercase tracking-wider">
                    {project.company}
                  </span>
                  <h3 className="font-display text-xl font-semibold mt-1 text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {project.description}
                </p>

                {/* Metrics */}
                <ul className="space-y-2 mb-6">
                  {project.metrics.map((metric) => (
                    <li key={metric} className="text-sm text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {metric}
                    </li>
                  ))}
                </ul>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-md bg-secondary text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Hover arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-5 h-5 text-primary" />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
