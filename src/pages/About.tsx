import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Download, Briefcase, Wrench, GitBranch, Lightbulb } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getIcon } from "@/lib/iconMap";

const About = () => {
  const { data: experiences, isLoading: experiencesLoading } = useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: tools, isLoading: toolsLoading } = useQuery({
    queryKey: ["toolkit_tools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("toolkit_tools")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: methodologies, isLoading: methodologiesLoading } = useQuery({
    queryKey: ["toolkit_methodologies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("toolkit_methodologies")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: skills, isLoading: skillsLoading } = useQuery({
    queryKey: ["toolkit_skills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("toolkit_skills")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Resume URL query
  const { data: resumeSetting } = useQuery({
    queryKey: ["site_settings", "resume_url"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", "resume_url")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const isLoading = experiencesLoading || toolsLoading || methodologiesLoading || skillsLoading;

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">About <span className="text-gradient">Me</span></h1>
            <p className="text-xl text-muted-foreground mb-8">Senior Product Manager with 8+ years of experience building impactful products across B2B SaaS, e-commerce, and travel industries.</p>
            {resumeSetting?.value ? (
              <Button asChild className="bg-gradient-primary hover:opacity-90">
                <a href={resumeSetting.value} target="_blank" rel="noopener noreferrer" download>
                  <Download className="mr-2 w-4 h-4" />Download Resume
                </a>
              </Button>
            ) : (
              <Button disabled className="bg-gradient-primary opacity-50 cursor-not-allowed">
                <Download className="mr-2 w-4 h-4" />Resume Coming Soon
              </Button>
            )}
          </div>

          <div className="max-w-4xl mx-auto mt-20">
            <h2 className="font-display text-2xl font-bold mb-8 flex items-center gap-3"><Briefcase className="w-6 h-6 text-primary" />Experience</h2>
            {experiencesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-6 rounded-xl bg-card border border-border animate-pulse">
                    <div className="h-6 bg-muted rounded w-1/2 mb-3" />
                    <div className="h-4 bg-muted rounded w-1/4 mb-3" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : experiences && experiences.length > 0 ? (
              <div className="space-y-8">
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-6 rounded-xl bg-card border border-border">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                      <h3 className="font-display font-semibold text-lg">{exp.role}</h3>
                      <span className="text-sm text-muted-foreground">{exp.period}</span>
                    </div>
                    <p className="text-primary font-medium mb-3">{exp.company}</p>
                    <ul className="space-y-1">
                      {exp.highlights?.map((h, j) => (
                        <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />{h}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded-xl bg-card border border-border">
                <p className="text-muted-foreground">No experiences added yet.</p>
              </div>
            )}
          </div>

          <div className="max-w-4xl mx-auto mt-20">
            <h2 className="font-display text-2xl font-bold mb-8">My Toolkit</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-6 rounded-xl bg-card border border-border animate-pulse">
                    <div className="h-6 bg-muted rounded w-1/2 mb-4" />
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="h-8 bg-muted rounded w-20" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-primary" />Tools
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tools?.map((tool) => {
                      const Icon = getIcon(tool.icon_name);
                      return (
                        <span key={tool.id} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5" />
                          {tool.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-primary" />Methodologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {methodologies?.map((method) => {
                      const Icon = getIcon(method.icon_name);
                      return (
                        <span key={method.id} className="px-3 py-1.5 rounded-lg bg-secondary text-foreground text-sm flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5" />
                          {method.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" />Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills?.map((skill) => {
                      const Icon = getIcon(skill.icon_name);
                      return (
                        <span key={skill.id} className="px-3 py-1.5 rounded-lg bg-accent/10 text-accent-foreground text-sm flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5" />
                          {skill.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
