import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useAdminRole } from "@/hooks/useAdminRole";

const ProjectEditor = () => {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAdmin, loading: authLoading } = useAdminRole();

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [metrics, setMetrics] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([""]);
  const [gradient, setGradient] = useState("from-primary to-accent");
  const [isFeatured, setIsFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      if (isNew) return null;
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !isNew && !!user,
  });

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setCompany(project.company);
      setDescription(project.description);
      setMetrics(project.metrics?.length ? project.metrics : [""]);
      setTags(project.tags?.length ? project.tags : [""]);
      setGradient(project.gradient || "from-primary to-accent");
      setIsFeatured(project.is_featured);
      setDisplayOrder(project.display_order);
    }
  }, [project]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const filteredMetrics = metrics.filter((m) => m.trim() !== "");
      const filteredTags = tags.filter((t) => t.trim() !== "");
      const data = {
        title,
        company,
        description,
        metrics: filteredMetrics,
        tags: filteredTags,
        gradient,
        is_featured: isFeatured,
        display_order: displayOrder,
      };

      if (isNew) {
        const { error } = await supabase.from("projects").insert(data);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").update(data).eq("id", id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({ title: isNew ? "Project created" : "Project updated" });
      navigate("/admin");
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const addMetric = () => setMetrics([...metrics, ""]);
  const removeMetric = (index: number) => setMetrics(metrics.filter((_, i) => i !== index));
  const updateMetric = (index: number, value: string) => {
    const updated = [...metrics];
    updated[index] = value;
    setMetrics(updated);
  };

  const addTag = () => setTags([...tags, ""]);
  const removeTag = (index: number) => setTags(tags.filter((_, i) => i !== index));
  const updateTag = (index: number, value: string) => {
    const updated = [...tags];
    updated[index] = value;
    setTags(updated);
  };

  if (authLoading || isLoading) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!user || !isAdmin) {
    navigate("/admin");
    return null;
  }

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-2xl">
          <Button variant="ghost" onClick={() => navigate("/admin")} className="mb-6">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Admin
          </Button>

          <h1 className="font-display text-3xl font-bold mb-8">
            {isNew ? "Add Project" : "Edit Project"}
          </h1>

          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Project title"
              />
            </div>

            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company name"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief project description"
                rows={3}
              />
            </div>

            <div>
              <Label>Metrics</Label>
              <div className="space-y-2 mt-2">
                {metrics.map((metric, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={metric}
                      onChange={(e) => updateMetric(index, e.target.value)}
                      placeholder="e.g., 50% conversion increase"
                    />
                    {metrics.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMetric(index)}
                        className="text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addMetric}>
                  <Plus className="mr-2 w-4 h-4" />
                  Add Metric
                </Button>
              </div>
            </div>

            <div>
              <Label>Tags</Label>
              <div className="space-y-2 mt-2">
                {tags.map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={tag}
                      onChange={(e) => updateTag(index, e.target.value)}
                      placeholder="e.g., B2B SaaS"
                    />
                    {tags.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTag(index)}
                        className="text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addTag}>
                  <Plus className="mr-2 w-4 h-4" />
                  Add Tag
                </Button>
              </div>
            </div>

            <div className="flex flex-row items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch
                  id="featured"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
                <Label htmlFor="featured">Featured on homepage</Label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending || !title || !company || !description}
                className="bg-gradient-primary hover:opacity-90"
              >
                {saveMutation.isPending ? "Saving..." : "Save Project"}
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

export default ProjectEditor;
