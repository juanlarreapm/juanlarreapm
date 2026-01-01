import { Layout } from "@/components/layout/Layout";
import { Wrench, GitBranch, Lightbulb } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getIcon } from "@/lib/iconMap";

const Toolkit = () => {
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

  const isLoading = toolsLoading || methodologiesLoading || skillsLoading;

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              My <span className="text-gradient">Toolkit</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              The tools, methodologies, and skills I use to build great products.
            </p>
          </div>

          {isLoading ? (
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-8 rounded-xl bg-card border border-border animate-pulse">
                  <div className="h-6 bg-muted rounded w-1/2 mb-6" />
                  <div className="flex flex-wrap gap-3">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div key={j} className="h-10 bg-muted rounded w-24" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-xl bg-card border border-border">
                <h2 className="font-display font-semibold text-xl mb-6 flex items-center gap-3">
                  <Wrench className="w-6 h-6 text-primary" />
                  Tools
                </h2>
                <div className="flex flex-wrap gap-3">
                  {tools?.map((tool) => {
                    const Icon = getIcon(tool.icon_name);
                    return (
                      <span
                        key={tool.id}
                        className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium flex items-center gap-2"
                      >
                        <Icon className="w-4 h-4" />
                        {tool.name}
                      </span>
                    );
                  })}
                  {(!tools || tools.length === 0) && (
                    <p className="text-muted-foreground text-sm">No tools added yet.</p>
                  )}
                </div>
              </div>

              <div className="p-8 rounded-xl bg-card border border-border">
                <h2 className="font-display font-semibold text-xl mb-6 flex items-center gap-3">
                  <GitBranch className="w-6 h-6 text-primary" />
                  Methodologies
                </h2>
                <div className="flex flex-wrap gap-3">
                  {methodologies?.map((method) => {
                    const Icon = getIcon(method.icon_name);
                    return (
                      <span
                        key={method.id}
                        className="px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium flex items-center gap-2"
                      >
                        <Icon className="w-4 h-4" />
                        {method.name}
                      </span>
                    );
                  })}
                  {(!methodologies || methodologies.length === 0) && (
                    <p className="text-muted-foreground text-sm">No methodologies added yet.</p>
                  )}
                </div>
              </div>

              <div className="p-8 rounded-xl bg-card border border-border">
                <h2 className="font-display font-semibold text-xl mb-6 flex items-center gap-3">
                  <Lightbulb className="w-6 h-6 text-primary" />
                  Skills
                </h2>
                <div className="flex flex-wrap gap-3">
                  {skills?.map((skill) => {
                    const Icon = getIcon(skill.icon_name);
                    return (
                      <span
                        key={skill.id}
                        className="px-4 py-2 rounded-lg bg-accent/10 text-accent-foreground text-sm font-medium flex items-center gap-2"
                      >
                        <Icon className="w-4 h-4" />
                        {skill.name}
                      </span>
                    );
                  })}
                  {(!skills || skills.length === 0) && (
                    <p className="text-muted-foreground text-sm">No skills added yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Toolkit;
