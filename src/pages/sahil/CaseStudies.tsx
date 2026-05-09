import { SahilLayout } from "@/components/sahil/SahilLayout";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const yearOf = (d?: string | null) => (d ? new Date(d).getFullYear().toString() : "—");

// Try to split a metric like "3.4× weekly buyers" or "Cut quote-to-order time to 90s"
// into a punchy value + label. Falls back gracefully.
const splitMetric = (m?: string): { value: string; label: string } | null => {
  if (!m) return null;
  const trimmed = m.trim();
  // Pattern: starts with number-ish token (digits, %, ×, x, $, +, -)
  const match = trimmed.match(/^([\$\+\-]?[\d.,]+\s*[%×xKMB+]*\.?)\s+(.*)$/i);
  if (match) return { value: match[1].trim(), label: match[2].trim() };
  // No numeric prefix — use whole string as value if short
  if (trimmed.length <= 14) return { value: trimmed, label: "" };
  return { value: trimmed.split(" ").slice(0, 2).join(" "), label: trimmed.split(" ").slice(2).join(" ") };
};

const SahilCaseStudies = () => {
  const { data: items, isLoading } = useQuery({
    queryKey: ["sahil-case-studies"],
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
    <SahilLayout>
      <section className="mb-12">
        <p className="sh-section-label">work</p>
        <h1 className="sh-title mb-6">Case studies.</h1>
        <p className="sh-hero">
          Twelve products, five industries, eight years. A handful of the ones I'm most proud of.
        </p>
      </section>

      {isLoading ? (
        <div className="sh-cards">
          {[1, 2, 3].map((i) => (
            <div key={i} className="sh-card-skeleton">
              <div className="bar" style={{ width: "20%" }} />
              <div className="bar" style={{ width: "60%", height: 24 }} />
              <div className="bar" style={{ width: "85%" }} />
              <div className="bar" style={{ width: "40%" }} />
            </div>
          ))}
        </div>
      ) : items && items.length > 0 ? (
        <div className="sh-cards">
          {items.map((cs) => {
            const tags = (cs.tags || []).slice(0, 2);
            return (
              <Link
                key={cs.id}
                to={`/case-studies/${cs.slug || cs.id}`}
                className="sh-card sh-card--no-stat"
              >
                <div className="sh-card-text">
                  <div className="sh-card-eyebrow">{cs.company}</div>
                  <h2 className="sh-card-title">
                    {cs.title}
                    <span className="sh-card-arrow">→</span>
                  </h2>
                  {cs.description && <p className="sh-card-pitch">{cs.description}</p>}
                  <div className="sh-card-meta">
                    {cs.industry && <span>{cs.industry}</span>}
                    {cs.industry && tags.length > 0 && <span className="sh-card-meta-sep">·</span>}
                    {tags.map((t: string, i: number) => (
                      <span key={t}>
                        {t}
                        {i < tags.length - 1 && <span className="sh-card-meta-sep" style={{ marginLeft: "0.75rem" }}>·</span>}
                      </span>
                    ))}
                    <span className="sh-card-period">{yearOf(cs.created_at)}</span>
                  </div>
                </div>
                {stat && (
                  <div className="sh-card-stat">
                    <span className="sh-card-stat-value">{stat.value}</span>
                    {stat.label && <span className="sh-card-stat-label">{stat.label}</span>}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="sh-muted">No case studies yet.</p>
      )}
    </SahilLayout>
  );
};

export default SahilCaseStudies;
