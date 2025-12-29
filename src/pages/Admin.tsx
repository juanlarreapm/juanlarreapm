import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Eye, EyeOff, LogOut, Briefcase, FolderKanban, Wrench, FileText, Settings, Upload, File } from "lucide-react";
import { format } from "date-fns";
import { useAdminRole } from "@/hooks/useAdminRole";
import { getIcon } from "@/lib/iconMap";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAdmin, loading } = useAdminRole();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Blog posts query
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("author_id", user?.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Experiences query
  const { data: experiences, isLoading: experiencesLoading } = useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  // Projects query
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  // Toolkit queries
  const { data: tools } = useQuery({
    queryKey: ["toolkit_tools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("toolkit_tools")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  const { data: methodologies } = useQuery({
    queryKey: ["toolkit_methodologies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("toolkit_methodologies")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  const { data: skills } = useQuery({
    queryKey: ["toolkit_skills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("toolkit_skills")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  // Resume URL query
  const { data: resumeSetting, isLoading: resumeLoading } = useQuery({
    queryKey: ["site_settings", "resume_url"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", "resume_url")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  // Delete mutations
  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      toast({ title: "Post deleted" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete post", variant: "destructive" });
    },
  });

  const deleteExperienceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("experiences").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      toast({ title: "Experience deleted" });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({ title: "Project deleted" });
    },
  });

  const deleteToolkitItemMutation = useMutation({
    mutationFn: async ({ table, id }: { table: string; id: string }) => {
      const { error } = await supabase.from(table as "toolkit_tools").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { table }) => {
      queryClient.invalidateQueries({ queryKey: [table] });
      toast({ title: "Item deleted" });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase
        .from("blog_posts")
        .update({ published, published_at: published ? new Date().toISOString() : null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      toast({ title: "Post updated" });
    },
  });

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({ title: "Error", description: "Please upload a PDF file", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      // Upload file to storage
      const fileName = `resume-${Date.now()}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("resumes")
        .getPublicUrl(fileName);

      // Upsert site setting
      const { error: settingError } = await supabase
        .from("site_settings")
        .upsert({ key: "resume_url", value: publicUrl }, { onConflict: "key" });

      if (settingError) throw settingError;

      queryClient.invalidateQueries({ queryKey: ["site_settings", "resume_url"] });
      toast({ title: "Resume uploaded successfully" });
    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: "Error", description: "Failed to upload resume", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
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

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your content</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 w-4 h-4" />
              Logout
            </Button>
          </div>

          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="posts" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Blog Posts
              </TabsTrigger>
              {isAdmin && (
                <>
                  <TabsTrigger value="experiences" className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Experiences
                  </TabsTrigger>
                  <TabsTrigger value="projects" className="flex items-center gap-2">
                    <FolderKanban className="w-4 h-4" />
                    Projects
                  </TabsTrigger>
                  <TabsTrigger value="toolkit" className="flex items-center gap-2">
                    <Wrench className="w-4 h-4" />
                    Toolkit
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            {/* Blog Posts Tab */}
            <TabsContent value="posts">
              <div className="flex justify-end mb-6">
                <Button asChild className="bg-gradient-primary hover:opacity-90">
                  <Link to="/admin/posts/new">
                    <Plus className="mr-2 w-4 h-4" />
                    New Post
                  </Link>
                </Button>
              </div>

              {postsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 rounded-xl bg-card border border-border animate-pulse">
                      <div className="h-6 bg-muted rounded w-1/2 mb-3" />
                      <div className="h-4 bg-muted rounded w-1/4" />
                    </div>
                  ))}
                </div>
              ) : posts && posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="p-6 rounded-xl bg-card border border-border flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-display font-semibold text-lg">{post.title}</h3>
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              post.published
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {post.published ? "Published" : "Draft"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Created {format(new Date(post.created_at), "MMM d, yyyy")}
                          {post.published_at && ` • Published ${format(new Date(post.published_at), "MMM d, yyyy")}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => togglePublishMutation.mutate({ id: post.id, published: !post.published })}
                          title={post.published ? "Unpublish" : "Publish"}
                        >
                          {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/admin/posts/${post.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deletePostMutation.mutate(post.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 rounded-xl bg-card border border-border">
                  <p className="text-muted-foreground mb-4">No posts yet</p>
                  <Button asChild className="bg-gradient-primary hover:opacity-90">
                    <Link to="/admin/posts/new">
                      <Plus className="mr-2 w-4 h-4" />
                      Create your first post
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Experiences Tab */}
            <TabsContent value="experiences">
              <div className="flex justify-end mb-6">
                <Button asChild className="bg-gradient-primary hover:opacity-90">
                  <Link to="/admin/experiences/new">
                    <Plus className="mr-2 w-4 h-4" />
                    Add Experience
                  </Link>
                </Button>
              </div>

              {experiencesLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-6 rounded-xl bg-card border border-border animate-pulse">
                      <div className="h-6 bg-muted rounded w-1/2 mb-3" />
                      <div className="h-4 bg-muted rounded w-1/4" />
                    </div>
                  ))}
                </div>
              ) : experiences && experiences.length > 0 ? (
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-6 rounded-xl bg-card border border-border flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-lg">{exp.role}</h3>
                        <p className="text-primary">{exp.company}</p>
                        <p className="text-sm text-muted-foreground">{exp.period}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/admin/experiences/${exp.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteExperienceMutation.mutate(exp.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 rounded-xl bg-card border border-border">
                  <p className="text-muted-foreground mb-4">No experiences yet</p>
                  <Button asChild className="bg-gradient-primary hover:opacity-90">
                    <Link to="/admin/experiences/new">
                      <Plus className="mr-2 w-4 h-4" />
                      Add your first experience
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects">
              <div className="flex justify-end mb-6">
                <Button asChild className="bg-gradient-primary hover:opacity-90">
                  <Link to="/admin/projects/new">
                    <Plus className="mr-2 w-4 h-4" />
                    Add Project
                  </Link>
                </Button>
              </div>

              {projectsLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-6 rounded-xl bg-card border border-border animate-pulse">
                      <div className="h-6 bg-muted rounded w-1/2 mb-3" />
                      <div className="h-4 bg-muted rounded w-1/4" />
                    </div>
                  ))}
                </div>
              ) : projects && projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="p-6 rounded-xl bg-card border border-border flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-display font-semibold text-lg">{project.title}</h3>
                          {project.is_featured && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-primary">{project.company}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/admin/projects/${project.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteProjectMutation.mutate(project.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 rounded-xl bg-card border border-border">
                  <p className="text-muted-foreground mb-4">No projects yet</p>
                  <Button asChild className="bg-gradient-primary hover:opacity-90">
                    <Link to="/admin/projects/new">
                      <Plus className="mr-2 w-4 h-4" />
                      Add your first project
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Toolkit Tab */}
            <TabsContent value="toolkit">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tools */}
                <div className="p-6 rounded-xl bg-card border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-semibold">Tools</h3>
                    <Button size="sm" asChild>
                      <Link to="/admin/toolkit/tools/new">
                        <Plus className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {tools?.map((tool) => {
                      const Icon = getIcon(tool.icon_name);
                      return (
                        <div key={tool.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-primary" />
                            <span className="text-sm">{tool.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                              <Link to={`/admin/toolkit/tools/${tool.id}`}>
                                <Edit className="w-3 h-3" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => deleteToolkitItemMutation.mutate({ table: "toolkit_tools", id: tool.id })}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Methodologies */}
                <div className="p-6 rounded-xl bg-card border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-semibold">Methodologies</h3>
                    <Button size="sm" asChild>
                      <Link to="/admin/toolkit/methodologies/new">
                        <Plus className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {methodologies?.map((method) => {
                      const Icon = getIcon(method.icon_name);
                      return (
                        <div key={method.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-primary" />
                            <span className="text-sm">{method.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                              <Link to={`/admin/toolkit/methodologies/${method.id}`}>
                                <Edit className="w-3 h-3" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => deleteToolkitItemMutation.mutate({ table: "toolkit_methodologies", id: method.id })}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Skills */}
                <div className="p-6 rounded-xl bg-card border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-semibold">Skills</h3>
                    <Button size="sm" asChild>
                      <Link to="/admin/toolkit/skills/new">
                        <Plus className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {skills?.map((skill) => {
                      const Icon = getIcon(skill.icon_name);
                      return (
                        <div key={skill.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-primary" />
                            <span className="text-sm">{skill.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                              <Link to={`/admin/toolkit/skills/${skill.id}`}>
                                <Edit className="w-3 h-3" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => deleteToolkitItemMutation.mutate({ table: "toolkit_skills", id: skill.id })}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="max-w-2xl">
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="font-display font-semibold text-lg mb-4">Resume</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload your resume (PDF) to enable the download button on the About page.
                  </p>
                  
                  {resumeSetting?.value && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 mb-4">
                      <File className="w-5 h-5 text-primary" />
                      <span className="text-sm flex-1 truncate">Current resume uploaded</span>
                      <a 
                        href={resumeSetting.value} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        View
                      </a>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    <Upload className="mr-2 w-4 h-4" />
                    {uploading ? "Uploading..." : resumeSetting?.value ? "Replace Resume" : "Upload Resume"}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
