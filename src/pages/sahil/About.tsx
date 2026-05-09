import { SahilLayout } from "@/components/sahil/SahilLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const SahilAbout = () => {
  const { data: experiences } = useQuery({
    queryKey: ["sahil-experiences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: bio } = useQuery({
    queryKey: ["site_settings", "bio"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("value").eq("key", "bio").maybeSingle();
      return data?.value as string | undefined;
    },
  });

  const { data: resume } = useQuery({
    queryKey: ["site_settings", "resume_url"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("value").eq("key", "resume_url").maybeSingle();
      return data?.value as string | undefined;
    },
  });

  return (
    <SahilLayout>
      <section className="mb-16">
        <p className="sh-section-label">about</p>
        <h1 className="sh-title mb-6">A few notes on me.</h1>
        <p className="sh-hero mb-6">
          {bio ||
            "Senior Product Manager with 8+ years building impactful products across B2B SaaS, e-commerce, and fintech. I like the part of the job where you sit with a customer and figure out what's actually going on."}
        </p>
        {resume && (
          <p className="sh-hero">
            If you'd rather skim, here's the{" "}
            <a href={resume} target="_blank" rel="noopener noreferrer" className="sh-link">
              resume
            </a>.
          </p>
        )}
      </section>

      {experiences && experiences.length > 0 && (
        <section className="mb-16">
          <p className="sh-section-label">where I've worked</p>
          <div className="sh-timeline">
            {experiences.map((exp) => (
              <article key={exp.id} className="sh-timeline-item">
                <p className="sh-timeline-period">{exp.period}</p>
                <p className="sh-timeline-role">
                  {exp.role}
                  {" · "}
                  {exp.company_url ? (
                    <a href={exp.company_url} target="_blank" rel="noopener noreferrer">
                      {exp.company}
                    </a>
                  ) : (
                    <span className="sh-muted">{exp.company}</span>
                  )}
                </p>
                {exp.description && <p className="sh-timeline-desc">{exp.description}</p>}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="sh-timeline-highlights">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
    </SahilLayout>
  );
};

export default SahilAbout;
