import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const PostEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [published, setPublished] = useState(false);
  const [readingTime, setReadingTime] = useState(5);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    });
  }, [navigate]);

  const { isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      if (isNew) return null;
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !isNew && !!user,
    meta: {
      onSuccess: (data: any) => {
        if (data) {
          setTitle(data.title);
          setSlug(data.slug);
          setExcerpt(data.excerpt || "");
          setContent(data.content);
          setCoverImage(data.cover_image || "");
          setPublished(data.published);
          setReadingTime(data.reading_time_minutes || 5);
        }
      }
    }
  });

  // Handle query success via effect
  const { data: postData } = useQuery({
    queryKey: ["post-data", id],
    queryFn: async () => {
      if (isNew) return null;
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !isNew && !!user,
  });

  useEffect(() => {
    if (postData) {
      setTitle(postData.title);
      setSlug(postData.slug);
      setExcerpt(postData.excerpt || "");
      setContent(postData.content);
      setCoverImage(postData.cover_image || "");
      setPublished(postData.published);
      setReadingTime(postData.reading_time_minutes || 5);
    }
  }, [postData]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (isNew) {
      setSlug(generateSlug(value));
    }
  };

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    setReadingTime(calculateReadingTime(value));
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");

      const postData = {
        title,
        slug,
        excerpt,
        content,
        cover_image: coverImage || null,
        published,
        published_at: published ? new Date().toISOString() : null,
        reading_time_minutes: readingTime,
        author_id: user.id,
      };

      if (isNew) {
        const { error } = await supabase.from("blog_posts").insert(postData);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: isNew ? "Post created!" : "Post saved!" });
      navigate("/admin");
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-display text-2xl font-bold">
              {isNew ? "New Post" : "Edit Post"}
            </h1>
          </div>

          <div className="space-y-6 p-8 rounded-xl bg-card border border-border">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="My Awesome Post"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-awesome-post"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief summary of your post..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input
                id="coverImage"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Write your post content here..."
                rows={15}
                className="font-mono text-sm"
                required
              />
              <p className="text-xs text-muted-foreground">
                Estimated reading time: {readingTime} min
              </p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
              <div>
                <Label htmlFor="published" className="font-medium">Publish</Label>
                <p className="text-sm text-muted-foreground">
                  Make this post visible to everyone
                </p>
              </div>
              <Switch
                id="published"
                checked={published}
                onCheckedChange={setPublished}
              />
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending || !title || !slug || !content}
                className="flex-1 bg-gradient-primary hover:opacity-90"
              >
                <Save className="mr-2 w-4 h-4" />
                {saveMutation.isPending ? "Saving..." : isNew ? "Create Post" : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={() => navigate("/admin")}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PostEditor;
