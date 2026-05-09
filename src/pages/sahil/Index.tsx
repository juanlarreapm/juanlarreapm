import { SahilLayout } from "@/components/sahil/SahilLayout";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBlogVisible } from "@/hooks/useBlogVisible";

const yearOf = (d?: string | null) => (d ? new Date(d).getFullYear().toString() : "—");

const SahilIndex = () => {
  const isBlogVisible = useBlogVisible();

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
          I'm Juan. I'm a senior product manager with eight years of product <Link to="/about" className="sh-link">experience</Link> taking products from zero to one and keeping them growing.
        </p>
        <p className="sh-hero mb-6">
          Right now I'm at{" "}
          <a href="https://partstech.com" target="_blank" rel="noopener noreferrer" className="sh-link">
            PartsTech
          </a>
          , rebuilding how auto shops buy parts.
        </p>
        <p className="sh-hero mb-6">
          I like to <Link to="/lab" className="sh-link">tinker</Link>. Most of my best
          product thinking starts with something I built myself.
        </p>
        <p className="sh-hero">
          {isBlogVisible && (
            <>
              I write occasionally about <Link to="/blog" className="sh-link">product, taste, and shipping</Link>.{" "}
            </>
          )}
          If you're hiring a PM who can build the thing, get it shipped, and know if it worked,{" "}
          <a href="mailto:juanlarreapm@gmail.com" className="sh-link">say hi</a>.
        </p>
      </section>


      {isBlogVisible && posts && posts.length > 0 && (
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
