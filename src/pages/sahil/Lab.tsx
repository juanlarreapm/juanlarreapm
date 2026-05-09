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
        <p className="sh-muted">loading…</p>
      ) : items && items.length > 0 ? (
        <ul className="sh-list">
          {items.map((p) => (
            <li key={p.id}>
              <span className="yr">{yearOf(p.project_date || p.created_at)}</span>
              <Link to={`/lab/${p.slug}`}>{p.title}</Link>
              <span className="meta">{p.tagline || p.status}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="sh-muted">No lab projects yet.</p>
      )}
    </SahilLayout>
  );
};

export default SahilLab;
