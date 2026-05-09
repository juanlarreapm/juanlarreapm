import { SahilLayout } from "@/components/sahil/SahilLayout";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const yearOf = (d?: string | null) => (d ? new Date(d).getFullYear().toString() : "—");

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
        <p className="sh-muted">loading…</p>
      ) : items && items.length > 0 ? (
        <ul className="sh-list">
          {items.map((cs) => (
            <li key={cs.id}>
              <span className="yr">{yearOf(cs.created_at)}</span>
              <Link to={`/case-studies/${cs.slug || cs.id}`}>{cs.title}</Link>
              <span className="meta">{cs.company}{cs.industry ? ` · ${cs.industry}` : ""}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="sh-muted">No case studies yet.</p>
      )}
    </SahilLayout>
  );
};

export default SahilCaseStudies;
