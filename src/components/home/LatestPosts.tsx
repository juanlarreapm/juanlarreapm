import { Link } from "react-router-dom";
import { Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
export function LatestPosts() {
  const {
    data: posts,
    isLoading
  } = useQuery({
    queryKey: ["latest-posts"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("blog_posts").select("*").eq("published", true).order("published_at", {
        ascending: false
      }).limit(3);
      if (error) throw error;
      return data;
    }
  });

  // Placeholder posts for when there are no blog posts yet
  const placeholderPosts = [{
    id: "1",
    title: "Getting Started with Machine Learning",
    excerpt: "My journey into the world of AI/ML and the first steps I'm taking to understand the fundamentals.",
    slug: "getting-started-ml",
    published_at: new Date().toISOString(),
    reading_time_minutes: 5
  }, {
    id: "2",
    title: "Building My First AI Prototype",
    excerpt: "A hands-on walkthrough of creating a simple AI-powered tool using modern frameworks.",
    slug: "first-ai-prototype",
    published_at: new Date().toISOString(),
    reading_time_minutes: 8
  }, {
    id: "3",
    title: "Product Thinking Meets AI",
    excerpt: "How my PM background shapes my approach to understanding and building AI products.",
    slug: "pm-meets-ai",
    published_at: new Date().toISOString(),
    reading_time_minutes: 6
  }];
  const displayPosts = posts && posts.length > 0 ? posts : placeholderPosts;
  const isPlaceholder = !posts || posts.length === 0;
  return <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Latest from the <span className="text-gradient">Blog</span>
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Documenting my AI/ML journey and sharing prototypes along the way
            </p>
          </div>
          <Button asChild variant="ghost" className="text-primary hover:text-primary/80">
            <Link to="/blog">
              View all posts
              
            </Link>
          </Button>
        </div>

        {isLoading ? <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="p-6 rounded-xl bg-card border border-border animate-pulse">
                <div className="h-4 bg-muted rounded w-1/4 mb-4" />
                <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>)}
          </div> : <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayPosts.map(post => <Link key={post.id} to={isPlaceholder ? "/blog" : `/blog/${post.slug}`} className="group block">
                <article className="h-full p-6 rounded-xl bg-card border border-border card-hover">
                  {isPlaceholder && <span className="inline-block px-2 py-1 text-xs rounded-md bg-secondary text-muted-foreground mb-3">
                      Coming Soon
                    </span>}
                  
                  <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-3">
                    {post.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.published_at ? format(new Date(post.published_at), "MMM d, yyyy") : "Soon"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.reading_time_minutes} min read
                    </span>
                  </div>
                </article>
              </Link>)}
          </div>}
      </div>
    </section>;
}