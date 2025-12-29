import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Projects = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">My <span className="text-gradient">Projects</span></h1>
            <p className="text-xl text-muted-foreground">A collection of impactful products I've built throughout my career.</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-6 rounded-xl bg-card border border-border animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/4 mb-2" />
                  <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                  <div className="h-4 bg-muted rounded w-full mb-4" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {projects.map((project) => (
                <article key={project.id} className="p-6 rounded-xl bg-card border border-border card-hover">
                  <span className="text-xs text-primary font-medium uppercase tracking-wider">{project.company}</span>
                  <h3 className="font-display text-xl font-semibold mt-1 mb-3">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                  <ul className="space-y-2 mb-4">
                    {project.metrics?.map((m, j) => (
                      <li key={j} className="text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />{m}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.map((tag) => (
                      <span key={tag} className="px-2 py-1 text-xs rounded-md bg-secondary text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-xl bg-card border border-border max-w-2xl mx-auto">
              <p className="text-muted-foreground">No projects added yet.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
