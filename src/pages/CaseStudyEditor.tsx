import { useState, useEffect, useRef } from "react";
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
import { ArrowLeft, Plus, X, Upload, Image } from "lucide-react";
import { useAdminRole } from "@/hooks/useAdminRole";

const CaseStudyEditor = () => {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAdmin, loading: authLoading } = useAdminRole();
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Basic info
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [role, setRole] = useState("");
  const [duration, setDuration] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);

  // Content sections
  const [problem, setProblem] = useState("");
  const [approach, setApproach] = useState("");
  const [solution, setSolution] = useState("");
  const [outcome, setOutcome] = useState("");
  const [executionCollaboration, setExecutionCollaboration] = useState("");
  const [impactResults, setImpactResults] = useState("");
  const [reflections, setReflections] = useState("");

  // Arrays
  const [metrics, setMetrics] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([""]);
  const [teamComposition, setTeamComposition] = useState<string[]>([""]);
  const [toolsUsed, setToolsUsed] = useState<string[]>([""]);

  // Settings
  const [gradient, setGradient] = useState("from-primary to-accent");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);

  const { data: caseStudy, isLoading } = useQuery({
    queryKey: ["case-study-edit", id],
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
    if (caseStudy) {
      setTitle(caseStudy.title || "");
      setSlug(caseStudy.slug || "");
      setCompany(caseStudy.company || "");
      setDescription(caseStudy.description || "");
      setIndustry(caseStudy.industry || "");
      setRole(caseStudy.role || "");
      setDuration(caseStudy.duration || "");
      setCoverImage(caseStudy.cover_image || "");
      setProblem(caseStudy.problem || "");
      setApproach(caseStudy.approach || "");
      setSolution(caseStudy.solution || "");
      setOutcome(caseStudy.outcome || "");
      setExecutionCollaboration(caseStudy.execution_collaboration || "");
      setImpactResults(caseStudy.impact_results || "");
      setReflections(caseStudy.reflections || "");
      setMetrics(caseStudy.metrics?.length ? caseStudy.metrics : [""]);
      setTags(caseStudy.tags?.length ? caseStudy.tags : [""]);
      setTeamComposition(caseStudy.team_composition?.length ? caseStudy.team_composition : [""]);
      setToolsUsed(caseStudy.tools_used?.length ? caseStudy.tools_used : [""]);
      setGradient(caseStudy.gradient || "from-primary to-accent");
      setIsFeatured(caseStudy.is_featured || false);
      setIsPublished(caseStudy.published ?? true);
      setDisplayOrder(caseStudy.display_order || 0);
    }
  }, [caseStudy]);

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (isNew || !caseStudy?.slug) {
      setSlug(generateSlug(value));
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Please upload an image file", variant: "destructive" });
      return;
    }

    setUploadingCover(true);
    try {
      const fileName = `cover-${Date.now()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage
        .from("case-study-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("case-study-images")
        .getPublicUrl(fileName);

      setCoverImage(publicUrl);
      toast({ title: "Cover image uploaded" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const filteredMetrics = metrics.filter((m) => m.trim() !== "");
      const filteredTags = tags.filter((t) => t.trim() !== "");
      const filteredTeam = teamComposition.filter((t) => t.trim() !== "");
      const filteredTools = toolsUsed.filter((t) => t.trim() !== "");

      const data = {
        title,
        slug: slug || generateSlug(title),
        company,
        description,
        industry: industry || null,
        role: role || null,
        duration: duration || null,
        cover_image: coverImage || null,
        problem: problem || null,
        approach: approach || null,
        solution: solution || null,
        outcome: outcome || null,
        execution_collaboration: executionCollaboration || null,
        impact_results: impactResults || null,
        reflections: reflections || null,
        metrics: filteredMetrics,
        tags: filteredTags,
        team_composition: filteredTeam,
        tools_used: filteredTools,
        gradient,
        is_featured: isFeatured,
        published: isPublished,
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
      queryClient.invalidateQueries({ queryKey: ["case-studies"] });
      queryClient.invalidateQueries({ queryKey: ["featured-case-studies"] });
      toast({ title: isNew ? "Case study created" : "Case study updated" });
      navigate("/admin?tab=case-studies");
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Array helpers
  const createArrayHelpers = (
    arr: string[],
    setArr: React.Dispatch<React.SetStateAction<string[]>>
  ) => ({
    add: () => setArr([...arr, ""]),
    remove: (index: number) => setArr(arr.filter((_, i) => i !== index)),
    update: (index: number, value: string) => {
      const updated = [...arr];
      updated[index] = value;
      setArr(updated);
    },
  });

  const metricsHelpers = createArrayHelpers(metrics, setMetrics);
  const tagsHelpers = createArrayHelpers(tags, setTags);
  const teamHelpers = createArrayHelpers(teamComposition, setTeamComposition);
  const toolsHelpers = createArrayHelpers(toolsUsed, setToolsUsed);

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
        <div className="container mx-auto px-6 max-w-3xl">
          <Button variant="ghost" onClick={() => navigate("/admin?tab=case-studies")} className="mb-6">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Admin
          </Button>

          <h1 className="font-display text-3xl font-bold mb-8">
            {isNew ? "Add Case Study" : "Edit Case Study"}
          </h1>

          <div className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6 p-6 rounded-xl bg-card border border-border">
              <h2 className="font-display text-xl font-semibold">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Case study title"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="url-friendly-slug"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Will appear as: /case-studies/{slug || "..."}
                  </p>
                </div>

                <div>
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company name"
                  />
                </div>

                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., Fintech, E-commerce"
                  />
                </div>

                <div>
                  <Label htmlFor="role">Your Role</Label>
                  <Input
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g., Lead Product Manager"
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 6 months, Q1-Q3 2023"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Brief Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short summary for cards and previews"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="space-y-4 p-6 rounded-xl bg-card border border-border">
              <h2 className="font-display text-xl font-semibold">Cover Image</h2>
              
              {coverImage ? (
                <div className="relative">
                  <img 
                    src={coverImage} 
                    alt="Cover preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setCoverImage("")}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => coverInputRef.current?.click()}
                >
                  <Image className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Click to upload cover image</p>
                </div>
              )}
              
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
              />
              
              {!coverImage && (
                <Button
                  variant="outline"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={uploadingCover}
                >
                  <Upload className="mr-2 w-4 h-4" />
                  {uploadingCover ? "Uploading..." : "Upload Image"}
                </Button>
              )}
            </div>

            {/* Content Sections */}
            <div className="space-y-6 p-6 rounded-xl bg-card border border-border">
              <h2 className="font-display text-xl font-semibold">Content</h2>

              <div>
                <Label htmlFor="problem">Problem & Context</Label>
                <Textarea
                  id="problem"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="What was the problem and its context?"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="approach">Research & Insights</Label>
                <Textarea
                  id="approach"
                  value={approach}
                  onChange={(e) => setApproach(e.target.value)}
                  placeholder="What research did you conduct and what insights did you discover?"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="solution">Solution Exploration and Tradeoffs</Label>
                <Textarea
                  id="solution"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder="What solutions did you explore and what tradeoffs did you consider?"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="outcome">Final Solution</Label>
                <Textarea
                  id="outcome"
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  placeholder="What was the final solution you implemented?"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="executionCollaboration">Execution and Collaboration</Label>
                <Textarea
                  id="executionCollaboration"
                  value={executionCollaboration}
                  onChange={(e) => setExecutionCollaboration(e.target.value)}
                  placeholder="How did you execute and collaborate with stakeholders?"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="impactResults">Impact and Results</Label>
                <Textarea
                  id="impactResults"
                  value={impactResults}
                  onChange={(e) => setImpactResults(e.target.value)}
                  placeholder="What was the impact and measurable results?"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="reflections">What I'd Do Differently</Label>
                <Textarea
                  id="reflections"
                  value={reflections}
                  onChange={(e) => setReflections(e.target.value)}
                  placeholder="Looking back, what would you change or improve?"
                  rows={4}
                />
              </div>
            </div>

            {/* Goals & Success Metrics */}
            <div className="space-y-4 p-6 rounded-xl bg-card border border-border">
              <h2 className="font-display text-xl font-semibold">Goals & Success Metrics</h2>
              <div className="space-y-2">
                {metrics.map((metric, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={metric}
                      onChange={(e) => metricsHelpers.update(index, e.target.value)}
                      placeholder="e.g., Reduce checkout abandonment by 20%"
                    />
                    {metrics.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => metricsHelpers.remove(index)}
                        className="text-destructive shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={metricsHelpers.add}>
                  <Plus className="mr-2 w-4 h-4" />
                  Add Goal/Metric
                </Button>
              </div>
            </div>

            {/* Team & Tools */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 p-6 rounded-xl bg-card border border-border">
                <h2 className="font-display text-lg font-semibold">Team Composition</h2>
                <div className="space-y-2">
                  {teamComposition.map((member, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={member}
                        onChange={(e) => teamHelpers.update(index, e.target.value)}
                        placeholder="e.g., 2 Engineers"
                      />
                      {teamComposition.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => teamHelpers.remove(index)}
                          className="text-destructive shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={teamHelpers.add}>
                    <Plus className="mr-2 w-4 h-4" />
                    Add Team Member
                  </Button>
                </div>
              </div>

              <div className="space-y-4 p-6 rounded-xl bg-card border border-border">
                <h2 className="font-display text-lg font-semibold">Tools Used</h2>
                <div className="space-y-2">
                  {toolsUsed.map((tool, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={tool}
                        onChange={(e) => toolsHelpers.update(index, e.target.value)}
                        placeholder="e.g., Figma, Jira"
                      />
                      {toolsUsed.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toolsHelpers.remove(index)}
                          className="text-destructive shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={toolsHelpers.add}>
                    <Plus className="mr-2 w-4 h-4" />
                    Add Tool
                  </Button>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4 p-6 rounded-xl bg-card border border-border">
              <h2 className="font-display text-xl font-semibold">Tags</h2>
              <div className="space-y-2">
                {tags.map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={tag}
                      onChange={(e) => tagsHelpers.update(index, e.target.value)}
                      placeholder="e.g., B2B SaaS"
                    />
                    {tags.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => tagsHelpers.remove(index)}
                        className="text-destructive shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={tagsHelpers.add}>
                  <Plus className="mr-2 w-4 h-4" />
                  Add Tag
                </Button>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4 p-6 rounded-xl bg-card border border-border">
              <h2 className="font-display text-xl font-semibold">Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <Switch
                    id="published"
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                  />
                  <Label htmlFor="published">Published</Label>
                </div>
                
                <div className="flex items-center gap-3">
                  <Switch
                    id="featured"
                    checked={isFeatured}
                    onCheckedChange={setIsFeatured}
                  />
                  <Label htmlFor="featured">Featured on homepage</Label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending || !title || !company || !description}
                className="bg-gradient-primary hover:opacity-90"
              >
                {saveMutation.isPending ? "Saving..." : "Save Case Study"}
              </Button>
              <Button variant="outline" onClick={() => navigate("/admin?tab=case-studies")}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CaseStudyEditor;
