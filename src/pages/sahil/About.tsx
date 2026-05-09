import { SahilLayout } from "@/components/sahil/SahilLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const SahilAbout = () => {
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

      {companies && companies.length > 0 && (
        <section className="mb-16">
          <p className="sh-section-label">where I've worked</p>
          <div className="sh-timeline">
            {companies.map((company) => {
              const positions = (experiences || []).filter((e) => e.company_id === company.id);
              if (positions.length === 0) return null;
              return (
                <article key={company.id} className="sh-timeline-item">
                  <p className="sh-timeline-role">
                    {company.url ? (
                      <a href={company.url} target="_blank" rel="noopener noreferrer" className="sh-timeline-company">
                        {company.name}
                      </a>
                    ) : (
                      <span className="sh-timeline-company">{company.name}</span>
                    )}
                  </p>
                  <div className="sh-position-list">
                    {positions.map((exp) => (
                      <div key={exp.id} className="sh-position">
                        <p className="sh-position-role">{exp.role}</p>
                        <p className="sh-position-period">{exp.period}</p>
                        {exp.description && <p className="sh-timeline-desc">{exp.description}</p>}
                        {exp.highlights && exp.highlights.length > 0 && (
                          <ul className="sh-timeline-highlights">
                            {exp.highlights.map((h, i) => (
                              <li key={i}>{h}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </SahilLayout>
  );
};

export default SahilAbout;
