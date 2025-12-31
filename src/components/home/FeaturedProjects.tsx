import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
export function FeaturedProjects() {
  const {
    data: projects,
    isLoading
  } = useQuery({
    queryKey: ["featured-projects"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("projects").select("*").eq("is_featured", true).order("display_order", {
        ascending: true
      }).limit(3);
      if (error) throw error;
      return data;
    }
  });
  return <section className="py-24">
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
              
            </Link>
          </Button>
        </div>

        {isLoading ? <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="p-6 rounded-xl bg-card border border-border animate-pulse">
                <div className="h-4 bg-muted rounded w-1/4 mb-2" />
                <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                <div className="h-4 bg-muted rounded w-full mb-4" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>)}
          </div> : projects && projects.length > 0 ? <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 stagger-children">
            {projects.map(project => <Link key={project.id} to="/projects" className="group block">
                <article className="h-full p-6 rounded-xl bg-card border border-border card-hover overflow-hidden relative">
                  {/* Gradient accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${project.gradient || 'from-primary to-accent'}`} />
                  
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
                    {project.metrics?.map(metric => <li key={metric} className="text-sm text-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {metric}
                      </li>)}
                  </ul>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.map(tag => <span key={tag} className="px-2 py-1 text-xs rounded-md bg-secondary text-muted-foreground">
                        {tag}
                      </span>)}
                  </div>

                  {/* Hover arrow */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-5 h-5 text-primary" />
                  </div>
                </article>
              </Link>)}
          </div> : <div className="text-center py-16 rounded-xl bg-card border border-border">
            <p className="text-muted-foreground">No featured projects yet.</p>
          </div>}
      </div>
    </section>;
}