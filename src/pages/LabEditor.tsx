import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, X, Upload, Image, CalendarIcon } from "lucide-react";
import { useAdminRole } from "@/hooks/useAdminRole";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const LabEditor = () => {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAdmin, loading: authLoading } = useAdminRole();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [techStack, setTechStack] = useState<string[]>([""]);
  const [demoUrl, setDemoUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [status, setStatus] = useState("active");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [projectDate, setProjectDate] = useState<Date | undefined>(new Date());

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ["lab-project-edit", id],
    queryFn: async () => {
      if (isNew) return null;
      const { data, error } = await supabase
        .from("lab_projects")
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
      setTitle(project.title || "");
      setSlug(project.slug || "");
      setTagline(project.tagline || "");
      setDescription(project.description || "");
      setCoverImage(project.cover_image || "");
      setVideoUrl(project.video_url || "");
      setScreenshots(project.screenshots || []);
      setTechStack(project.tech_stack?.length ? project.tech_stack : [""]);
      setDemoUrl(project.demo_url || "");
      setGithubUrl(project.github_url || "");
      setStatus(project.status || "active");
      setDisplayOrder(project.display_order || 0);
      setIsPublished(project.published ?? true);
      setIsFeatured(project.is_featured || false);
      setProjectDate(project.project_date ? new Date(project.project_date) : new Date());
    }
  }, [project]);

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
    if (isNew || !project?.slug) {
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
      const fileName = `lab-cover-${Date.now()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage
        .from("lab-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("lab-images")
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

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Please upload an image file", variant: "destructive" });
      return;
    }

    setUploadingScreenshot(true);
    try {
      const fileName = `lab-screenshot-${Date.now()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage
        .from("lab-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("lab-images")
        .getPublicUrl(fileName);

      setScreenshots([...screenshots, publicUrl]);
      toast({ title: "Screenshot uploaded" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setUploadingScreenshot(false);
      if (screenshotInputRef.current) screenshotInputRef.current.value = "";
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshots(screenshots.filter((_, i) => i !== index));
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const filteredTechStack = techStack.filter((t) => t.trim() !== "");

      const data = {
        title,
        slug: slug || generateSlug(title),
        tagline: tagline || null,
        description: description || null,
        cover_image: coverImage || null,
        video_url: videoUrl || null,
        screenshots,
        tech_stack: filteredTechStack,
        demo_url: demoUrl || null,
        github_url: githubUrl || null,
        status,
        display_order: displayOrder,
        published: isPublished,
        is_featured: isFeatured,
        project_date: projectDate ? format(projectDate, "yyyy-MM-dd") : null,
      };

      if (isNew) {
        const { error } = await supabase.from("lab_projects").insert(data);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("lab_projects").update(data).eq("id", id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-projects"] });
      queryClient.invalidateQueries({ queryKey: ["featured-lab-projects"] });
      toast({ title: isNew ? "Lab project created" : "Lab project updated" });
      navigate("/admin");
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Tech stack helpers
  const addTechItem = () => setTechStack([...techStack, ""]);
  const removeTechItem = (index: number) => setTechStack(techStack.filter((_, i) => i !== index));
  const updateTechItem = (index: number, value: string) => {
    const updated = [...techStack];
    updated[index] = value;
    setTechStack(updated);
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
        <div className="container mx-auto px-6 max-w-3xl">
          <Button variant="ghost" onClick={() => navigate("/admin")} className="mb-6">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Admin
          </Button>

          <h1 className="font-display text-3xl font-bold mb-8">
            {isNew ? "Add Lab Project" : "Edit Lab Project"}
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
                    placeholder="Project name"
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
                    Will appear as: /lab/{slug || "..."}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="One-liner description"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What does this project do? What problem does it solve?"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label>Project Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !projectDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {projectDate ? format(projectDate, "MMMM yyyy") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={projectDate}
                        onSelect={setProjectDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-muted-foreground mt-1">
                    Date shown on the project page
                  </p>
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

            {/* Video */}
            <div className="space-y-4 p-6 rounded-xl bg-card border border-border">
              <h2 className="font-display text-xl font-semibold">Video (Optional)</h2>
              <p className="text-sm text-muted-foreground">Supports YouTube and Loom links</p>
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... or https://loom.com/share/..."
              />
            </div>

            {/* Screenshots */}
            <div className="space-y-4 p-6 rounded-xl bg-card border border-border">
              <h2 className="font-display text-xl font-semibold">Screenshots</h2>
              
              {screenshots.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {screenshots.map((screenshot, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={screenshot} 
                        alt={`Screenshot ${index + 1}`} 
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeScreenshot(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <input
                ref={screenshotInputRef}
                type="file"
                accept="image/*"
                onChange={handleScreenshotUpload}
                className="hidden"
              />
              
              <Button
                variant="outline"
                onClick={() => screenshotInputRef.current?.click()}
                disabled={uploadingScreenshot}
              >
                <Plus className="mr-2 w-4 h-4" />
                {uploadingScreenshot ? "Uploading..." : "Add Screenshot"}
              </Button>
            </div>

            {/* Tech Stack */}
            <div className="space-y-4 p-6 rounded-xl bg-card border border-border">
              <h2 className="font-display text-xl font-semibold">Tech Stack</h2>
              <div className="space-y-2">
                {techStack.map((tech, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={tech}
                      onChange={(e) => updateTechItem(index, e.target.value)}
                      placeholder="e.g., React, TypeScript, Supabase"
                    />
                    {techStack.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeTechItem(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={addTechItem}>
                  <Plus className="mr-2 w-4 h-4" /> Add Technology
                </Button>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-4 p-6 rounded-xl bg-card border border-border">
              <h2 className="font-display text-xl font-semibold">Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="demoUrl">Demo URL</Label>
                  <Input
                    id="demoUrl"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input
                    id="githubUrl"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4 p-6 rounded-xl bg-card border border-border">
              <h2 className="font-display text-xl font-semibold">Settings</h2>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Published</Label>
                  <p className="text-sm text-muted-foreground">Make this project visible on the site</p>
                </div>
                <Switch checked={isPublished} onCheckedChange={setIsPublished} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Featured</Label>
                  <p className="text-sm text-muted-foreground">Show on homepage</p>
                </div>
                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !title.trim()}
              className="w-full bg-gradient-primary"
            >
              {saveMutation.isPending ? "Saving..." : isNew ? "Create Lab Project" : "Save Changes"}
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LabEditor;
