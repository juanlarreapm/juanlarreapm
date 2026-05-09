import { SahilLayout } from "@/components/sahil/SahilLayout";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const yearOf = (d?: string | null) => (d ? new Date(d).getFullYear().toString() : "—");

const SahilLab = () => {
  const { data: items, isLoading } = useQuery({
    queryKey: ["sahil-lab"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lab_projects")
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
        <p className="sh-section-label">lab</p>
        <h1 className="sh-title mb-6">Side projects.</h1>
        <p className="sh-hero">
          Things I built to scratch an itch, learn something new, or test a tiny hypothesis.
        </p>
      </section>

      {isLoading ? (
        <div className="sh-cards">
          {[1, 2, 3].map((i) => (
            <div key={i} className="sh-card-skeleton">
              <div className="bar" style={{ width: "15%" }} />
              <div className="bar" style={{ width: "55%", height: 24 }} />
              <div className="bar" style={{ width: "85%" }} />
              <div className="bar" style={{ width: "40%" }} />
            </div>
          ))}
        </div>
      ) : items && items.length > 0 ? (
        <div className="sh-cards">
          {items.map((p) => {
            const stack = p.tech_stack || [];
            const isActive = (p.status || "").toLowerCase() === "active";
            return (
              <Link
                key={p.id}
                to={`/lab/${p.slug}`}
                className="sh-card sh-card--no-stat"
              >
                <div className="sh-card-text">
                  <div className="sh-card-eyebrow">
                    {isActive && <span className="sh-status-dot" />}
                    {p.status || "project"}
                  </div>
                  <h2 className="sh-card-title">
                    {p.title}
                    <span className="sh-card-arrow">→</span>
                  </h2>
                  {p.tagline && <p className="sh-card-pitch">{p.tagline}</p>}
                  <div className="sh-card-meta">
                    {stack.slice(0, 4).map((t: string, i: number, arr: string[]) => (
                      <span key={t}>
                        {t}
                        {i < arr.length - 1 && <span className="sh-card-meta-sep" style={{ marginLeft: "0.75rem" }}>·</span>}
                      </span>
                    ))}
                    {stack.length > 0 && <span className="sh-card-meta-sep">·</span>}
                    <span className="sh-card-period">{yearOf(p.project_date || p.created_at)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="sh-muted">No lab projects yet.</p>
      )}
    </SahilLayout>
  );
};

export default SahilLab;
