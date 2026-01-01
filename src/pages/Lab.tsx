import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, ExternalLink, Github, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Lab = () => {
  const { data: labProjects, isLoading } = useQuery({
    queryKey: ["lab-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lab_projects")
        .select("*")
        .eq("published", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "in progress":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "archived":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-primary/20 text-primary border-primary/30";
    }
  };

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              The <span className="text-gradient">Lab</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Side projects, experiments, and things I've built for fun (or to scratch an itch).
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl bg-card border border-border animate-pulse overflow-hidden">
                  <div className="h-48 bg-muted" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : labProjects && labProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {labProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/lab/${project.slug}`}
                  className="group block"
                >
                  <article className="h-full rounded-xl bg-card border border-border card-hover overflow-hidden">
                    {/* Cover Image or Video Thumbnail */}
                    <div className="relative h-48 bg-secondary overflow-hidden">
                      {project.cover_image ? (
                        <img
                          src={project.cover_image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                          <span className="text-4xl font-display font-bold text-primary/40">
                            {project.title.charAt(0)}
                          </span>
                        </div>
                      )}
                      
                      {/* Video indicator */}
                      {project.video_url && (
                        <div className="absolute bottom-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm">
                          <Play className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      
                      {/* Status badge */}
                      <Badge 
                        className={`absolute top-3 left-3 ${getStatusColor(project.status)} border`}
                      >
                        {project.status}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      
                      {project.tagline && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {project.tagline}
                        </p>
                      )}

                      {/* Tech stack */}
                      {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tech_stack.slice(0, 4).map((tech: string) => (
                            <span
                              key={tech}
                              className="px-2 py-1 text-xs rounded-md bg-secondary text-muted-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.tech_stack.length > 4 && (
                            <span className="px-2 py-1 text-xs rounded-md bg-secondary text-muted-foreground">
                              +{project.tech_stack.length - 4}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Links preview */}
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {project.demo_url && (
                          <span className="flex items-center gap-1">
                            <ExternalLink className="w-3.5 h-3.5" />
                            Demo
                          </span>
                        )}
                        {project.github_url && (
                          <span className="flex items-center gap-1">
                            <Github className="w-3.5 h-3.5" />
                            Code
                          </span>
                        )}
                        <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-primary">
                          View <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-xl bg-card border border-border max-w-2xl mx-auto">
              <p className="text-muted-foreground">No lab projects added yet.</p>
              <p className="text-sm text-muted-foreground mt-2">Check back soon for experiments and side projects!</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Lab;
