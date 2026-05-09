import { SahilLayout } from "@/components/sahil/SahilLayout";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Section = ({ label, html }: { label: string; html?: string | null }) =>
  html ? (
    <section className="mb-12">
      <p className="sh-section-label">{label}</p>
      <div className="sh-prose" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  ) : null;

const SahilCaseStudy = () => {
  const { slug } = useParams();

  const { data: cs, isLoading, error } = useQuery({
    queryKey: ["sahil-case-study", slug],
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

  if (isLoading) {
    return (
      <SahilLayout>
        <p className="sh-muted">loading…</p>
      </SahilLayout>
    );
  }

  if (error || !cs) {
    return (
      <SahilLayout>
        <h1 className="sh-title mb-4">Not found.</h1>
        <p className="sh-hero">
          That case study has wandered off. <Link to="/case-studies" className="sh-link">Back to work</Link>.
        </p>
      </SahilLayout>
    );
  }

  return (
    <SahilLayout>
      <section className="mb-10">
        <Link to="/case-studies" className="sh-link" style={{ fontSize: 14 }}>← back to work</Link>
        <p className="sh-section-label mt-6">{cs.company}{cs.industry ? ` · ${cs.industry}` : ""}</p>
        <h1 className="sh-title mb-4">{cs.title}</h1>
        <p className="sh-hero">{cs.description}</p>

        <div className="mt-6 sh-chip flex flex-wrap gap-x-4">
          {cs.role && <span>role · {cs.role}</span>}
          {cs.duration && <span>duration · {cs.duration}</span>}
        </div>
      </section>

      <Section label="problem & context" html={cs.problem} />

      {cs.metrics && cs.metrics.length > 0 && (
        <section className="mb-12">
          <p className="sh-section-label">goals & success metrics</p>
          <ul className="sh-prose" style={{ paddingLeft: "1.25rem" }}>
            {cs.metrics.map((m: string, i: number) => <li key={i}>{m}</li>)}
          </ul>
        </section>
      )}

      <Section label="research & insights" html={cs.approach} />
      <Section label="solution exploration" html={cs.solution} />
      <Section label="final solution" html={cs.outcome} />
      <Section label="execution and collaboration" html={cs.execution_collaboration} />

      {(cs.team_composition?.length > 0 || cs.tools_used?.length > 0) && (
        <section className="mb-12">
          {cs.team_composition?.length > 0 && (
            <div className="mb-6">
              <p className="sh-section-label">team</p>
              <p className="sh-body">{cs.team_composition.join(" · ")}</p>
            </div>
          )}
          {cs.tools_used?.length > 0 && (
            <div>
              <p className="sh-section-label">tools</p>
              <p className="sh-body">{cs.tools_used.join(" · ")}</p>
            </div>
          )}
        </section>
      )}

      <Section label="impact and results" html={cs.impact_results} />
      <Section label="what I'd do differently" html={cs.reflections} />

      {cs.tags && cs.tags.length > 0 && (
        <p className="sh-chip mt-12">
          {cs.tags.map((t: string, i: number) => (
            <span key={t} className="sh-tag">{t}</span>
          ))}
        </p>
      )}
    </SahilLayout>
  );
};

export default SahilCaseStudy;
