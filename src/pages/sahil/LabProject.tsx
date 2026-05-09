import { SahilLayout } from "@/components/sahil/SahilLayout";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Github } from "lucide-react";
import { format } from "date-fns";

const getEmbedUrl = (url: string) => {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const lo = url.match(/loom\.com\/share\/([^?]+)/);
  if (lo) return `https://www.loom.com/embed/${lo[1]}`;
  return url;
};

const SahilLabProject = () => {
  const { slug } = useParams();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ["sahil-lab-project", slug],
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

  if (isLoading) {
    return <SahilLayout><p className="sh-muted">loading…</p></SahilLayout>;
  }

  if (error || !project) {
    return (
      <SahilLayout>
        <h1 className="sh-title mb-4">Not found.</h1>
        <p className="sh-hero">
          <Link to="/lab" className="sh-link">Back to the lab</Link>.
        </p>
      </SahilLayout>
    );
  }

  const embed = project.video_url ? getEmbedUrl(project.video_url) : null;

  return (
    <SahilLayout>
      <section className="mb-10">
        <Link to="/lab" className="sh-link" style={{ fontSize: 14 }}>← back to the lab</Link>
        <p className="sh-section-label mt-6">
          {format(new Date(project.project_date || project.created_at), "MMMM yyyy")} · {project.status}
        </p>
        <h1 className="sh-title mb-4">{project.title}</h1>
        {project.tagline && <p className="sh-hero">{project.tagline}</p>}

        <div className="mt-6 flex flex-wrap items-center gap-4">
          {project.demo_url && (
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="sh-link inline-flex items-center gap-1">
              <ExternalLink size={14} /> live demo
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="sh-link inline-flex items-center gap-1">
              <Github size={14} /> source
            </a>
          )}
        </div>

        {project.tech_stack?.length > 0 && (
          <p className="sh-chip mt-6">{project.tech_stack.join(" · ")}</p>
        )}
      </section>

      {embed && (
        <section className="mb-12">
          <div style={{ position: "relative", paddingBottom: "56.25%", borderRadius: 6, overflow: "hidden", border: "1px solid hsl(var(--sh-line))" }}>
            <iframe
              src={embed}
              title={project.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            />
          </div>
        </section>
      )}

      {!embed && project.cover_image && (
        <section className="mb-12">
          <img src={project.cover_image} alt={project.title} style={{ width: "100%", borderRadius: 6, border: "1px solid hsl(var(--sh-line))" }} />
        </section>
      )}

      {project.description && (
        <section className="mb-12">
          <div className="sh-prose" dangerouslySetInnerHTML={{ __html: project.description }} />
        </section>
      )}

      {project.screenshots?.length > 0 && (
        <section className="mb-12">
          <p className="sh-section-label">screenshots</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.screenshots.map((s: string, i: number) => (
              <img key={i} src={s} alt={`screenshot ${i + 1}`} style={{ width: "100%", borderRadius: 6, border: "1px solid hsl(var(--sh-line))" }} />
            ))}
          </div>
        </section>
      )}
    </SahilLayout>
  );
};

export default SahilLabProject;
