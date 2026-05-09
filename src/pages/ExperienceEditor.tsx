import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useAdminRole } from "@/hooks/useAdminRole";

const ExperienceEditor = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAdmin, loading: authLoading } = useAdminRole();

  const [companyId, setCompanyId] = useState<string>("");
  const [role, setRole] = useState("");
  const [period, setPeriod] = useState("");
  const [description, setDescription] = useState("");
  const [highlights, setHighlights] = useState<string[]>([""]);
  const [displayOrder, setDisplayOrder] = useState(0);

  const { data: companies } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: experience, isLoading } = useQuery({
    queryKey: ["experience", id],
    queryFn: async () => {
      if (isNew) return null;
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !isNew && !!user,
  });

  useEffect(() => {
    if (experience) {
      setCompanyId(experience.company_id || "");
      setRole(experience.role);
      setPeriod(experience.period);
      setDescription(experience.description || "");
      setHighlights(experience.highlights?.length ? experience.highlights : [""]);
      setDisplayOrder(experience.display_order);
    } else if (isNew) {
      const preselect = searchParams.get("company");
      if (preselect) setCompanyId(preselect);
    }
  }, [experience, isNew, searchParams]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const filteredHighlights = highlights.filter((h) => h.trim() !== "");
      const selected = companies?.find((c) => c.id === companyId);
      if (!selected) throw new Error("Please select a company");

      const data = {
        company_id: companyId,
        company: selected.name, // legacy field, kept in sync
        company_url: selected.url || null, // legacy field, kept in sync
        role,
        period,
        description: description.trim() || null,
        highlights: filteredHighlights,
        display_order: displayOrder,
      };

      if (isNew) {
        const { error } = await supabase.from("experiences").insert(data);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("experiences").update(data).eq("id", id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      toast({ title: isNew ? "Position created" : "Position updated" });
      navigate("/admin?tab=experiences");
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const addHighlight = () => setHighlights([...highlights, ""]);
  const removeHighlight = (index: number) => setHighlights(highlights.filter((_, i) => i !== index));
  const updateHighlight = (index: number, value: string) => {
    const updated = [...highlights];
    updated[index] = value;
    setHighlights(updated);
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
          <Button variant="ghost" onClick={() => navigate("/admin?tab=experiences")} className="mb-6">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Admin
          </Button>

          <h1 className="font-display text-3xl font-bold mb-8">
            {isNew ? "Add Position" : "Edit Position"}
          </h1>

          <div className="space-y-6">
            <div>
              <Label htmlFor="company">Company</Label>
              {companies && companies.length > 0 ? (
                <Select value={companyId} onValueChange={setCompanyId}>
                  <SelectTrigger id="company">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">
                  No companies yet.{" "}
                  <a href="/admin/companies/new" className="text-primary underline">
                    Create one first
                  </a>
                  .
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="role">Role / Title</Label>
              <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Your role/title" />
            </div>

            <div>
              <Label htmlFor="period">Period</Label>
              <Input
                id="period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="e.g., 2021 - Present"
              />
            </div>

            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief 1-2 sentence description of this role"
                className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
            </div>

            <div>
              <Label htmlFor="displayOrder">
                Display Order <span className="text-muted-foreground text-xs">(lower = newer, shown first within company)</span>
              </Label>
              <Input
                id="displayOrder"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label>Highlights</Label>
              <div className="space-y-2 mt-2">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={highlight}
                      onChange={(e) => updateHighlight(index, e.target.value)}
                      placeholder="Highlight or achievement"
                    />
                    {highlights.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeHighlight(index)}
                        className="text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addHighlight}>
                  <Plus className="mr-2 w-4 h-4" />
                  Add Highlight
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending || !companyId || !role || !period}
                className="bg-gradient-primary hover:opacity-90"
              >
                {saveMutation.isPending ? "Saving..." : "Save Position"}
              </Button>
              <Button variant="outline" onClick={() => navigate("/admin?tab=experiences")}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ExperienceEditor;
