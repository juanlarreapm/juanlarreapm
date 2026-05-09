import { SahilLayout } from "@/components/sahil/SahilLayout";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const SahilBlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["sahil-blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <SahilLayout><p className="sh-muted">loading…</p></SahilLayout>;

  if (error || !post) {
    return (
      <SahilLayout>
        <h1 className="sh-title mb-4">Not found.</h1>
        <p className="sh-hero">
          <Link to="/blog" className="sh-link">Back to writing</Link>.
        </p>
      </SahilLayout>
    );
  }

  return (
    <SahilLayout>
      <article>
        <Link to="/blog" className="sh-link" style={{ fontSize: 14 }}>← back to writing</Link>
        <header className="mt-6 mb-10">
          <p className="sh-section-label">
            {post.published_at ? format(new Date(post.published_at), "MMMM d, yyyy") : ""}
            {post.reading_time_minutes ? ` · ${post.reading_time_minutes} min read` : ""}
          </p>
          <h1 className="sh-title">{post.title}</h1>
          {post.excerpt && <p className="sh-hero mt-4 sh-muted">{post.excerpt}</p>}
        </header>

        {post.cover_image && (
          <img
            src={post.cover_image}
            alt={post.title}
            style={{ width: "100%", borderRadius: 6, border: "1px solid hsl(var(--sh-line))", marginBottom: "2rem" }}
          />
        )}

        <div className="sh-prose" dangerouslySetInnerHTML={{ __html: post.content }} />

        <hr className="sh-rule mt-16 mb-6" />
        <p className="sh-chip">
          Thanks for reading. <Link to="/contact" className="sh-link">say hi</Link> if it sparked something.
        </p>
      </article>
    </SahilLayout>
  );
};

export default SahilBlogPost;
