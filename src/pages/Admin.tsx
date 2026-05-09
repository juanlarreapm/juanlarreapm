import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Eye, EyeOff, LogOut, Briefcase, FolderKanban, Wrench, FileText, Settings, Upload, File, User, Image, Mail, Key, BookOpen, FlaskConical, BarChart3, Menu } from "lucide-react";
import { AnalyticsTab } from "@/components/admin/AnalyticsTab";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useAdminRole } from "@/hooks/useAdminRole";
import { getIcon } from "@/lib/iconMap";

const Admin = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAdmin, loading } = useAdminRole();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  
  const validTabs = ["posts", "experiences", "case-studies", "lab", "toolkit", "messages", "settings", "analytics"];
  const tabFromUrl = searchParams.get("tab");
  const activeTab = validTabs.includes(tabFromUrl || "") ? tabFromUrl! : "posts";
  
  const setActiveTab = (tab: string) => {
    setSearchParams({ tab }, { replace: true });
  };
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [bio, setBio] = useState("");
  const [savingBio, setSavingBio] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<{
    id: string;
    name: string;
    email: string;
    message: string;
    created_at: string;
  } | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "post" | "experience" | "project" | "lab" | "toolkit" | "message" | null;
    id: string;
    name: string;
    table?: string;
  } | null>(null);

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

  // Lab projects query
  const { data: labProjects, isLoading: labProjectsLoading } = useQuery({
    queryKey: ["admin-lab-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lab_projects")
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

  // Contact submissions query
  const { data: contactMessages, isLoading: messagesLoading } = useQuery({
    queryKey: ["contact_submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  // Site settings queries
  const { data: resumeSetting } = useQuery({
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

  const { data: profilePhotoSetting } = useQuery({
    queryKey: ["site_settings", "profile_photo_url"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", "profile_photo_url")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  const { data: bioSetting } = useQuery({
    queryKey: ["site_settings", "bio"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", "bio")
        .maybeSingle();
      if (error) throw error;
      if (data?.value && bio === "") setBio(data.value);
      return data;
    },
    enabled: !!user && isAdmin,
  });

  const { data: blogVisibilitySetting } = useQuery({
    queryKey: ["site_settings", "blog_visible"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", "blog_visible")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  const { data: toolkitVisibilitySetting } = useQuery({
    queryKey: ["site_settings", "toolkit_visible"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", "toolkit_visible")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  const { data: openToOpportunitiesSetting } = useQuery({
    queryKey: ["site_settings", "open_to_opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", "open_to_opportunities")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  const { data: activeThemeSetting } = useQuery({
    queryKey: ["site_settings", "active_theme"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", "active_theme")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  const setActiveTheme = async (value: "b2b" | "sahil") => {
    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert({ key: "active_theme", value }, { onConflict: "key" });
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["site_settings", "active_theme"] });
      toast({ title: `Live site is now ${value === "sahil" ? "Sahil" : "B2B"}` });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const toggleBlogVisibility = async () => {
    const currentValue = blogVisibilitySetting?.value === "true";
    const newValue = !currentValue;
    
    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert({ key: "blog_visible", value: newValue.toString() }, { onConflict: "key" });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["site_settings", "blog_visible"] });
      toast({ title: newValue ? "Blog is now visible" : "Blog is now hidden" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const toggleOpenToOpportunities = async () => {
    const currentValue = openToOpportunitiesSetting?.value === "true";
    const newValue = !currentValue;
    
    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert({ key: "open_to_opportunities", value: newValue.toString() }, { onConflict: "key" });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["site_settings", "open_to_opportunities"] });
      toast({ title: newValue ? "Open to Opportunities badge is now visible" : "Open to Opportunities badge is now hidden" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

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

  const deleteLabProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("lab_projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lab-projects"] });
      queryClient.invalidateQueries({ queryKey: ["lab-projects"] });
      toast({ title: "Lab project deleted" });
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

  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact_submissions"] });
      toast({ title: "Message deleted" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete message", variant: "destructive" });
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
      const fileName = `resume-${Date.now()}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("resumes")
        .getPublicUrl(fileName);

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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Please upload an image file", variant: "destructive" });
      return;
    }

    setUploadingPhoto(true);
    try {
      const fileName = `profile-${Date.now()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage
        .from("profile-photos")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("profile-photos")
        .getPublicUrl(fileName);

      const { error: settingError } = await supabase
        .from("site_settings")
        .upsert({ key: "profile_photo_url", value: publicUrl }, { onConflict: "key" });

      if (settingError) throw settingError;

      queryClient.invalidateQueries({ queryKey: ["site_settings", "profile_photo_url"] });
      toast({ title: "Profile photo uploaded successfully" });
    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: "Error", description: "Failed to upload photo", variant: "destructive" });
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  };

  const handleBioSave = async () => {
    setSavingBio(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert({ key: "bio", value: bio }, { onConflict: "key" });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["site_settings", "bio"] });
      toast({ title: "Bio saved successfully" });
    } catch (error) {
      console.error("Save error:", error);
      toast({ title: "Error", description: "Failed to save bio", variant: "destructive" });
    } finally {
      setSavingBio(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: "Password updated!", description: "Your password has been changed successfully." });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;
    
    switch (deleteConfirm.type) {
      case "post":
        deletePostMutation.mutate(deleteConfirm.id);
        break;
      case "experience":
        deleteExperienceMutation.mutate(deleteConfirm.id);
        break;
      case "project":
        deleteProjectMutation.mutate(deleteConfirm.id);
        break;
      case "lab":
        deleteLabProjectMutation.mutate(deleteConfirm.id);
        break;
      case "toolkit":
        if (deleteConfirm.table) {
          deleteToolkitItemMutation.mutate({ table: deleteConfirm.table, id: deleteConfirm.id });
        }
        break;
      case "message":
        deleteContactMutation.mutate(deleteConfirm.id);
        break;
    }
    setDeleteConfirm(null);
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Mobile dropdown navigation */}
            <div className="lg:hidden mb-6">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-full bg-card">
                  <div className="flex items-center gap-2">
                    <Menu className="w-4 h-4" />
                    <SelectValue placeholder="Select section" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="posts">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Blog Posts
                    </div>
                  </SelectItem>
                  {isAdmin && (
                    <>
                      <SelectItem value="experiences">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          Experiences
                        </div>
                      </SelectItem>
                      <SelectItem value="case-studies">
                        <div className="flex items-center gap-2">
                          <FolderKanban className="w-4 h-4" />
                          Case Studies
                        </div>
                      </SelectItem>
                      <SelectItem value="lab">
                        <div className="flex items-center gap-2">
                          <FlaskConical className="w-4 h-4" />
                          Lab
                        </div>
                      </SelectItem>
                      <SelectItem value="toolkit">
                        <div className="flex items-center gap-2">
                          <Wrench className="w-4 h-4" />
                          Toolkit
                        </div>
                      </SelectItem>
                      <SelectItem value="messages">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Messages
                          {contactMessages && contactMessages.length > 0 && (
                            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
                              {contactMessages.length}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                      <SelectItem value="settings">
                        <div className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Settings
                        </div>
                      </SelectItem>
                      <SelectItem value="analytics">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          Analytics
                        </div>
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Desktop tabs navigation */}
            <TabsList className="mb-6 hidden lg:flex">
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
                  <TabsTrigger value="case-studies" className="flex items-center gap-2">
                    <FolderKanban className="w-4 h-4" />
                    Case Studies
                  </TabsTrigger>
                  <TabsTrigger value="lab" className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4" />
                    Lab
                  </TabsTrigger>
                  <TabsTrigger value="toolkit" className="flex items-center gap-2">
                    <Wrench className="w-4 h-4" />
                    Toolkit
                  </TabsTrigger>
                  <TabsTrigger value="messages" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Messages
                    {contactMessages && contactMessages.length > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
                        {contactMessages.length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Analytics
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
                          onClick={() => setDeleteConfirm({ type: "post", id: post.id, name: post.title })}
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
                          onClick={() => setDeleteConfirm({ type: "experience", id: exp.id, name: `${exp.role} at ${exp.company}` })}
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

            {/* Case Studies Tab */}
            <TabsContent value="case-studies">
              <div className="flex justify-end mb-6">
                <Button asChild className="bg-gradient-primary hover:opacity-90">
                  <Link to="/admin/case-studies/new">
                    <Plus className="mr-2 w-4 h-4" />
                    Add Case Study
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
                          {!project.published && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">
                              Draft
                            </span>
                          )}
                        </div>
                        <p className="text-primary">{project.company}</p>
                        {project.industry && (
                          <p className="text-sm text-muted-foreground">{project.industry}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/admin/case-studies/${project.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirm({ type: "project", id: project.id, name: project.title })}
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
                  <p className="text-muted-foreground mb-4">No case studies yet</p>
                  <Button asChild className="bg-gradient-primary hover:opacity-90">
                    <Link to="/admin/case-studies/new">
                      <Plus className="mr-2 w-4 h-4" />
                      Add your first case study
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Lab Tab */}
            <TabsContent value="lab">
              <div className="flex justify-end mb-6">
                <Button asChild className="bg-gradient-primary hover:opacity-90">
                  <Link to="/admin/lab/new">
                    <Plus className="mr-2 w-4 h-4" />
                    Add Lab Project
                  </Link>
                </Button>
              </div>

              {labProjectsLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-6 rounded-xl bg-card border border-border animate-pulse">
                      <div className="h-6 bg-muted rounded w-1/2 mb-3" />
                      <div className="h-4 bg-muted rounded w-1/4" />
                    </div>
                  ))}
                </div>
              ) : labProjects && labProjects.length > 0 ? (
                <div className="space-y-4">
                  {labProjects.map((project) => (
                    <div
                      key={project.id}
                      className="p-6 rounded-xl bg-card border border-border flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-display font-semibold text-lg">{project.title}</h3>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            project.status === 'active' ? 'bg-green-500/20 text-green-400' :
                            project.status === 'in progress' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {project.status}
                          </span>
                          {project.is_featured && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
                              Featured
                            </span>
                          )}
                          {!project.published && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">
                              Draft
                            </span>
                          )}
                        </div>
                        {project.tagline && (
                          <p className="text-sm text-muted-foreground">{project.tagline}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/admin/lab/${project.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirm({ type: "lab", id: project.id, name: project.title })}
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
                  <p className="text-muted-foreground mb-4">No lab projects yet</p>
                  <Button asChild className="bg-gradient-primary hover:opacity-90">
                    <Link to="/admin/lab/new">
                      <Plus className="mr-2 w-4 h-4" />
                      Add your first lab project
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>

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
                              onClick={() => setDeleteConfirm({ type: "toolkit", id: tool.id, name: tool.name, table: "toolkit_tools" })}
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
                              onClick={() => setDeleteConfirm({ type: "toolkit", id: method.id, name: method.name, table: "toolkit_methodologies" })}
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
                              onClick={() => setDeleteConfirm({ type: "toolkit", id: skill.id, name: skill.name, table: "toolkit_skills" })}
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

            {/* Messages Tab */}
            <TabsContent value="messages">
              {messagesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 rounded-xl bg-card border border-border animate-pulse">
                      <div className="h-6 bg-muted rounded w-1/3 mb-3" />
                      <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </div>
                  ))}
                </div>
              ) : contactMessages && contactMessages.length > 0 ? (
                <div className="space-y-4">
                  {contactMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-6 rounded-xl bg-card border border-border flex flex-col md:flex-row md:items-start md:justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-display font-semibold text-lg">{msg.name}</h3>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(msg.created_at), "MMM d, yyyy 'at' h:mm a")}
                          </span>
                        </div>
                        <a href={`mailto:${msg.email}`} className="text-primary hover:underline text-sm mb-2 block">
                          {msg.email}
                        </a>
                        <p className="text-sm text-muted-foreground line-clamp-2">{msg.message}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedMessage(msg)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirm({ type: "message", id: msg.id, name: `message from ${msg.name}` })}
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
                  <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No messages yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Contact form submissions will appear here
                  </p>
                </div>
              )}

              {/* Message Detail Dialog */}
              <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Message from {selectedMessage?.name}</DialogTitle>
                  </DialogHeader>
                  {selectedMessage && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Email</p>
                        <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline">
                          {selectedMessage.email}
                        </a>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Received</p>
                        <p>{format(new Date(selectedMessage.created_at), "MMMM d, yyyy 'at' h:mm a")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Message</p>
                        <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button asChild className="flex-1 bg-gradient-primary hover:opacity-90">
                          <a href={`mailto:${selectedMessage.email}`}>
                            <Mail className="w-4 h-4 mr-2" />
                            Reply via Email
                          </a>
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            deleteContactMutation.mutate(selectedMessage.id);
                            setSelectedMessage(null);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="max-w-2xl space-y-6">
                {/* Profile Photo */}
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                    <Image className="w-5 h-5 text-primary" />
                    Profile Photo
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload your profile photo to display on the About page.
                  </p>
                  
                  {profilePhotoSetting?.value && (
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        src={profilePhotoSetting.value} 
                        alt="Profile" 
                        className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                      />
                      <span className="text-sm text-muted-foreground">Current photo</span>
                    </div>
                  )}

                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => photoInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    <Upload className="mr-2 w-4 h-4" />
                    {uploadingPhoto ? "Uploading..." : profilePhotoSetting?.value ? "Replace Photo" : "Upload Photo"}
                  </Button>
                </div>

                {/* Bio */}
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Bio
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Write a short bio to display on the About page.
                  </p>
                  
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write your bio here..."
                    className="mb-4 min-h-[120px]"
                  />
                  <Button
                    onClick={handleBioSave}
                    disabled={savingBio}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    {savingBio ? "Saving..." : "Save Bio"}
                  </Button>
                </div>

                {/* Resume */}
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                    <File className="w-5 h-5 text-primary" />
                    Resume
                  </h3>
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

                {/* Open to Opportunities */}
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Open to Opportunities
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Show or hide the "Open to new PM opportunities" badge on the homepage.
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <Button
                      variant={openToOpportunitiesSetting?.value === "true" ? "default" : "outline"}
                      onClick={toggleOpenToOpportunities}
                      className={openToOpportunitiesSetting?.value === "true" ? "bg-gradient-primary hover:opacity-90" : ""}
                    >
                      {openToOpportunitiesSetting?.value === "true" ? (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Badge Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" />
                          Badge Hidden
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Live Site Design */}
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Live Site Design
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Switch the live site between the original B2B design and the new Sahil editorial design.
                    The change applies to every public page and the admin shell.
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      variant={(activeThemeSetting?.value ?? "b2b") === "b2b" ? "default" : "outline"}
                      onClick={() => setActiveTheme("b2b")}
                      className={(activeThemeSetting?.value ?? "b2b") === "b2b" ? "bg-gradient-primary hover:opacity-90" : ""}
                    >
                      B2B (current)
                    </Button>
                    <Button
                      variant={activeThemeSetting?.value === "sahil" ? "default" : "outline"}
                      onClick={() => setActiveTheme("sahil")}
                      className={activeThemeSetting?.value === "sahil" ? "bg-gradient-primary hover:opacity-90" : ""}
                    >
                      Sahil
                    </Button>
                    <span className="text-xs text-muted-foreground ml-2">
                      Active: <strong>{activeThemeSetting?.value === "sahil" ? "Sahil" : "B2B"}</strong>
                    </span>
                  </div>
                </div>


                <div className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Blog Visibility
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Show or hide the Blog tab from the navigation menu.
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <Button
                      variant={blogVisibilitySetting?.value === "true" ? "default" : "outline"}
                      onClick={toggleBlogVisibility}
                      className={blogVisibilitySetting?.value === "true" ? "bg-gradient-primary hover:opacity-90" : ""}
                    >
                      {blogVisibilitySetting?.value === "true" ? (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Blog Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" />
                          Blog Hidden
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Change Password */}
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                    <Key className="w-5 h-5 text-primary" />
                    Change Password
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Update your account password.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        minLength={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        minLength={6}
                      />
                    </div>
                    <Button
                      onClick={handlePasswordChange}
                      disabled={changingPassword || !newPassword || !confirmPassword}
                      className="bg-gradient-primary hover:opacity-90"
                    >
                      {changingPassword ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            {isAdmin && (
              <TabsContent value="analytics">
                <AnalyticsTab />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </section>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deleteConfirm?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Admin;
