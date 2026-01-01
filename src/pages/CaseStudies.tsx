import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";

const CaseStudies = () => {
  const { data: caseStudies, isLoading } = useQuery({
    queryKey: ["case-studies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("published", true)
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
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Case <span className="text-gradient">Studies</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Deep dives into impactful products I've built throughout my career.
            </p>
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
          ) : caseStudies && caseStudies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {caseStudies.map((caseStudy) => (
                <Link
                  key={caseStudy.id}
                  to={`/case-studies/${caseStudy.slug || caseStudy.id}`}
                  className="group block"
                >
                  <article className="h-full p-6 rounded-xl bg-card border border-border card-hover relative overflow-hidden">
                    {/* Gradient accent */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${caseStudy.gradient || 'from-primary to-accent'}`} />
                    
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-primary font-medium uppercase tracking-wider">
                            {caseStudy.company}
                          </span>
                          {caseStudy.industry && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                {caseStudy.industry}
                              </span>
                            </>
                          )}
                        </div>
                        
                        <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                          {caseStudy.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {caseStudy.description}
                        </p>

                        {/* Key metric highlight */}
                        {caseStudy.metrics && caseStudy.metrics.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                              <span className="text-foreground">{caseStudy.metrics[0]}</span>
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {caseStudy.tags?.slice(0, 3).map((tag: string) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs rounded-md bg-secondary text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Arrow indicator */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                        <ArrowRight className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-xl bg-card border border-border max-w-2xl mx-auto">
              <p className="text-muted-foreground">No case studies added yet.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CaseStudies;
