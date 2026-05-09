import { SahilLayout } from "@/components/sahil/SahilLayout";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const SahilBlog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["sahil-blog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <SahilLayout>
      <section className="mb-12">
        <p className="sh-section-label">writing</p>
        <h1 className="sh-title mb-6">Notes & essays.</h1>
        <p className="sh-hero">
          Occasional writing on product, taste, and shipping things.
        </p>
      </section>

      {isLoading ? (
        <p className="sh-muted">loading…</p>
      ) : posts && posts.length > 0 ? (
        <ul className="sh-list">
          {posts.map((p) => (
            <li key={p.id}>
              <span className="yr">{p.published_at ? format(new Date(p.published_at), "yyyy") : "—"}</span>
              <Link to={`/blog/${p.slug}`}>{p.title}</Link>
              <span className="meta">{p.published_at ? format(new Date(p.published_at), "MMM d") : ""}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="sh-muted">No posts yet.</p>
      )}
    </SahilLayout>
  );
};

export default SahilBlog;
