import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Clock, Calendar, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*, profiles(full_name)")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-display text-3xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">The post you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="py-24">
        <div className="container mx-auto px-6 max-w-3xl">
          {/* Back button */}
          <Link
            to="/blog"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-12">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {post.profiles && (
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.profiles.full_name || "Anonymous"}
                </span>
              )}
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {format(new Date(post.published_at!), "MMMM d, yyyy")}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.reading_time_minutes} min read
              </span>
            </div>
          </header>

          {/* Cover image */}
          {post.cover_image && (
            <div className="mb-12 rounded-xl overflow-hidden">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose-dark max-w-none">
            {post.content.split("\n").map((paragraph, i) => (
              <p key={i} className="mb-4 text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Thanks for reading! Feel free to reach out if you have questions.
              </p>
              <Button asChild variant="outline">
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </footer>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
