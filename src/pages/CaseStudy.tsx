import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Building2, Calendar, Users, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CaseStudy = () => {
  const { slug } = useParams();

  const { data: caseStudy, isLoading, error } = useQuery({
    queryKey: ["case-study", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: otherCaseStudies } = useQuery({
    queryKey: ["other-case-studies", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, slug, company, industry")
        .eq("published", true)
        .neq("slug", slug)
        .order("display_order", { ascending: true })
        .limit(3);
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-1/4" />
              <div className="h-12 bg-muted rounded w-3/4" />
              <div className="h-64 bg-muted rounded" />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (error || !caseStudy) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-display text-3xl font-bold mb-4">Case Study Not Found</h1>
            <p className="text-muted-foreground mb-6">The case study you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/case-studies">View All Case Studies</Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        {caseStudy.cover_image && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: `url(${caseStudy.cover_image})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        
        <div className="container mx-auto px-6 max-w-4xl relative">
          <Button variant="ghost" asChild className="mb-8">
            <Link to="/case-studies">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Case Studies
            </Link>
          </Button>

          <div className="space-y-4">
            {caseStudy.industry && (
              <Badge variant="secondary" className="text-xs uppercase tracking-wider">
                {caseStudy.industry}
              </Badge>
            )}
            
            <h1 className="font-display text-4xl md:text-5xl font-bold">
              {caseStudy.title}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl">
              {caseStudy.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                <span>{caseStudy.company}</span>
              </div>
              {caseStudy.role && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>{caseStudy.role}</span>
                </div>
              )}
              {caseStudy.duration && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{caseStudy.duration}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {caseStudy.tags && caseStudy.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4">
                {caseStudy.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 text-sm rounded-full bg-secondary text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="pb-24">
        <div className="container mx-auto px-6 max-w-4xl space-y-16">
          {/* Problem & Context */}
          {caseStudy.problem && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-primary">Problem & Context</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap">{caseStudy.problem}</p>
              </div>
            </div>
          )}

          {/* Goals & Success Metrics */}
          {caseStudy.metrics && caseStudy.metrics.length > 0 && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold text-primary">Goals & Success Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caseStudy.metrics.map((metric: string, index: number) => (
                  <div 
                    key={index} 
                    className="p-6 rounded-xl bg-card border border-border"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="text-lg">{metric}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Research & Insights */}
          {caseStudy.approach && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-primary">Research & Insights</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap">{caseStudy.approach}</p>
              </div>
            </div>
          )}

          {/* Solution Exploration and Tradeoffs */}
          {caseStudy.solution && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-primary">Solution Exploration and Tradeoffs</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap">{caseStudy.solution}</p>
              </div>
            </div>
          )}

          {/* Final Solution */}
          {caseStudy.outcome && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-primary">Final Solution</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap">{caseStudy.outcome}</p>
              </div>
            </div>
          )}

          {/* Execution and Collaboration */}
          {(caseStudy.execution_collaboration || caseStudy.team_composition?.length > 0 || caseStudy.tools_used?.length > 0) && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold text-primary">Execution and Collaboration</h2>
              
              {caseStudy.execution_collaboration && (
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-muted-foreground whitespace-pre-wrap">{caseStudy.execution_collaboration}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {caseStudy.team_composition && caseStudy.team_composition.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-display text-xl font-semibold flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Team Composition
                    </h3>
                    <ul className="space-y-2">
                      {caseStudy.team_composition.map((member: string, index: number) => (
                        <li key={index} className="flex items-center gap-2 text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {member}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {caseStudy.tools_used && caseStudy.tools_used.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-display text-xl font-semibold flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-primary" />
                      Tools Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.tools_used.map((tool: string, index: number) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 text-sm rounded-md bg-secondary text-muted-foreground"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Impact and Results */}
          {caseStudy.impact_results && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-primary">Impact and Results</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap">{caseStudy.impact_results}</p>
              </div>
            </div>
          )}

          {/* What I'd Do Differently */}
          {caseStudy.reflections && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-primary">What I'd Do Differently</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap">{caseStudy.reflections}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* More Case Studies */}
      {otherCaseStudies && otherCaseStudies.length > 0 && (
        <section className="py-16 border-t border-border">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="font-display text-2xl font-bold mb-8">More Case Studies</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherCaseStudies.map((study) => (
                <Link 
                  key={study.id} 
                  to={`/case-studies/${study.slug}`}
                  className="group p-6 rounded-xl bg-card border border-border card-hover"
                >
                  {study.industry && (
                    <span className="text-xs text-primary font-medium uppercase tracking-wider">
                      {study.industry}
                    </span>
                  )}
                  <h3 className="font-display font-semibold mt-1 group-hover:text-primary transition-colors">
                    {study.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{study.company}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default CaseStudy;
