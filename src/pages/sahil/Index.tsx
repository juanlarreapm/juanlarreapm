import { SahilLayout } from "@/components/sahil/SahilLayout";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBlogVisible } from "@/hooks/useBlogVisible";

const yearOf = (d?: string | null) => (d ? new Date(d).getFullYear().toString() : "—");

const SahilIndex = () => {
  const isBlogVisible = useBlogVisible();
  const { data: caseStudies } = useQuery({
    queryKey: ["sahil-home-case-studies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, slug, company, created_at")
        .eq("published", true)
        .order("display_order", { ascending: true })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["sahil-home-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  return (
    <SahilLayout>
      {/* Hero letter */}
      <section className="mb-20">
        <p className="sh-hero mb-6">
          I'm Juan. I'm a <span className="sh-accent">senior product manager</span> helping
          B2B SaaS companies go from zero to one — then grow it. I've shipped twelve
          products across five industries over the last eight years.
        </p>
        <p className="sh-hero mb-6">
          Right now I'm at{" "}
          <a href="https://partstech.com" target="_blank" rel="noopener noreferrer" className="sh-link">
            PartsTech
          </a>
          , rebuilding how shops buy parts. Before that: retail at Nordstrom, edtech at
          Intellum, and consumer loyalty at INWEGO and Merchants Preferred.
        </p>
        <p className="sh-hero">
          {isBlogVisible && (
            <>
              I write occasionally about <Link to="/blog" className="sh-link">product, taste, and shipping</Link>.{" "}
            </>
          )}
          If you're hiring a PM who can build the thing, sell it internally, and find
          the metric that matters —{" "}
          <a href="mailto:juanlarreapm@gmail.com" className="sh-link">say hi</a>.
        </p>
      </section>

      <section className="mb-12">
        <div className="sh-signature">— juan</div>
      </section>

      {caseStudies && caseStudies.length > 0 && (
        <section className="mb-16">
          <p className="sh-section-label">selected work</p>
          <ul className="sh-list">
            {caseStudies.map((cs) => (
              <li key={cs.id}>
                <span className="yr">{yearOf(cs.created_at)}</span>
                <Link to={`/case-studies/${cs.slug}`}>{cs.title}</Link>
                <span className="meta">{cs.company}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {posts && posts.length > 0 && (
        <section className="mb-16">
          <p className="sh-section-label">recent writing</p>
          <ul className="sh-list">
            {posts.map((p) => (
              <li key={p.id}>
                <span className="yr">{yearOf(p.published_at)}</span>
                <Link to={`/blog/${p.slug}`}>{p.title}</Link>
                <span className="meta" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </SahilLayout>
  );
};

export default SahilIndex;
