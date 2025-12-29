import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Clock, Calendar } from "lucide-react";

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("published", true).order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">The <span className="text-gradient">Blog</span></h1>
            <p className="text-xl text-muted-foreground">Documenting my journey into AI/ML and sharing prototypes along the way.</p>
          </div>
          <div className="max-w-3xl mx-auto">
            {isLoading ? (
              <div className="space-y-6">{[1,2,3].map(i => <div key={i} className="p-6 rounded-xl bg-card border border-border animate-pulse"><div className="h-6 bg-muted rounded w-3/4 mb-3" /><div className="h-4 bg-muted rounded w-full" /></div>)}</div>
            ) : posts && posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="block p-6 rounded-xl bg-card border border-border card-hover">
                    <h2 className="font-display text-xl font-semibold mb-2 hover:text-primary transition-colors">{post.title}</h2>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{format(new Date(post.published_at!), "MMM d, yyyy")}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.reading_time_minutes} min read</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 rounded-xl bg-card border border-border">
                <p className="text-muted-foreground mb-4">No posts yet. Check back soon!</p>
                <p className="text-sm text-muted-foreground">I'm working on content about my AI/ML journey.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
