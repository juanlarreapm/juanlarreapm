import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Download, Briefcase, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const About = () => {
  const { data: companies } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

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

  // Site settings queries
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

  const { data: profilePhotoSetting } = useQuery({
    queryKey: ["site_settings", "profile_photo_url"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", "profile_photo_url")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: bioSetting } = useQuery({
    queryKey: ["site_settings", "bio"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", "bio")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
              {profilePhotoSetting?.value && (
                <img 
                  src={profilePhotoSetting.value} 
                  alt="Profile" 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-primary shadow-lg"
                />
              )}
              <div className="text-center md:text-left">
                <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">About <span className="text-gradient">Me</span></h1>
                <p className="text-xl text-muted-foreground mb-6">
                  {bioSetting?.value || "Senior Product Manager with 8+ years of experience building impactful products across B2B SaaS, e-commerce, and fintech industries."}
                </p>
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
            </div>
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
                    {exp.company_url ? (
                      <a 
                        href={exp.company_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary font-medium mb-2 inline-flex items-center gap-1.5 hover:underline"
                      >
                        {exp.company}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <p className="text-primary font-medium mb-2">{exp.company}</p>
                    )}
                    {exp.description && (
                      <p className="text-sm text-muted-foreground mb-3 italic">{exp.description}</p>
                    )}
                    <ul className="space-y-2">
                      {exp.highlights?.map((h, j) => (
                        <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />{h}
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

        </div>
      </section>
    </Layout>
  );
};

export default About;
