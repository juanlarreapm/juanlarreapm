import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ExternalLink, Github, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const LabProject = () => {
  const { slug } = useParams();

  const {
    data: project,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lab-project", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lab_projects")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: otherProjects } = useQuery({
    queryKey: ["other-lab-projects", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lab_projects")
        .select("id, title, slug, tagline, cover_image, status")
        .eq("published", true)
        .neq("slug", slug)
        .order("display_order", { ascending: true })
        .limit(3);
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "in progress":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "archived":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-primary/20 text-primary border-primary/30";
    }
  };

  // Extract video embed URL (supports YouTube and Loom)
  const getEmbedUrl = (url: string) => {
    if (!url) return null;

    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Loom
    const loomMatch = url.match(/loom\.com\/share\/([^?]+)/);
    if (loomMatch) {
      return `https://www.loom.com/embed/${loomMatch[1]}`;
    }

    return url;
  };

  if (isLoading) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-1/4" />
              <div className="h-12 bg-muted rounded w-3/4" />
              <div className="h-96 bg-muted rounded" />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-display text-3xl font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/lab">View All Lab Projects</Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  const embedUrl = project.video_url ? getEmbedUrl(project.video_url) : null;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-4xl">
          <Button variant="ghost" asChild className="mb-8">
            <Link to="/lab">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Lab
            </Link>
          </Button>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className={`${getStatusColor(project.status)} border`}>{project.status}</Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {format(new Date(project.project_date || project.created_at), "MMMM yyyy")}
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-bold">{project.title}</h1>

            {project.tagline && <p className="text-xl text-muted-foreground max-w-2xl">{project.tagline}</p>}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              {project.demo_url && (
                <Button asChild className="bg-gradient-primary">
                  <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 w-4 h-4" />
                    Try It Out
                  </a>
                </Button>
              )}
              {project.github_url && (
                <Button variant="outline" asChild>
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 w-4 h-4" />
                    View Code
                  </a>
                </Button>
              )}
            </div>

            {/* Tech stack */}
            {project.tech_stack && project.tech_stack.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4">
                {project.tech_stack.map((tech: string) => (
                  <span key={tech} className="px-3 py-1 text-sm rounded-full bg-secondary text-muted-foreground">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Media Section */}
      <section className="pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Video */}
          {embedUrl && (
            <div className="mb-8 rounded-xl overflow-hidden border border-border">
              <div className="relative pb-[56.25%]">
                <iframe
                  src={embedUrl}
                  title={project.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          )}

          {/* Cover image (show if no video) */}
          {!embedUrl && project.cover_image && (
            <div className="mb-8 rounded-xl overflow-hidden border border-border">
              <img src={project.cover_image} alt={project.title} className="w-full object-cover" />
            </div>
          )}

          {/* Description */}
          {project.description && (
            <div 
              className="prose prose-lg dark:prose-invert max-w-none mb-12 [&_img]:rounded-xl [&_img]:border [&_img]:border-border"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          )}

          {/* Screenshots gallery */}
          {project.screenshots && project.screenshots.length > 0 && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold text-primary">Screenshots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.screenshots.map((screenshot: string, index: number) => (
                  <div key={index} className="rounded-xl overflow-hidden border border-border">
                    <img
                      src={screenshot}
                      alt={`${project.title} screenshot ${index + 1}`}
                      className="w-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* More Projects */}
      {otherProjects && otherProjects.length > 0 && (
        <section className="py-16 border-t border-border">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="font-display text-2xl font-bold mb-8">More from the Lab</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherProjects.map((proj) => (
                <Link
                  key={proj.id}
                  to={`/lab/${proj.slug}`}
                  className="group rounded-xl bg-card border border-border card-hover overflow-hidden"
                >
                  {proj.cover_image ? (
                    <div className="h-32 overflow-hidden">
                      <img
                        src={proj.cover_image}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-2xl font-display font-bold text-primary/40">{proj.title.charAt(0)}</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-display font-semibold group-hover:text-primary transition-colors">
                      {proj.title}
                    </h3>
                    {proj.tagline && <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{proj.tagline}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default LabProject;
