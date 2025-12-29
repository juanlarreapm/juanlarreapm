import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useAdminRole } from "@/hooks/useAdminRole";
import { availableIcons, getIcon } from "@/lib/iconMap";

type ToolkitType = "tools" | "methodologies" | "skills";

const tableMap: Record<ToolkitType, string> = {
  tools: "toolkit_tools",
  methodologies: "toolkit_methodologies",
  skills: "toolkit_skills",
};

const ToolkitItemEditor = () => {
  const { type, id } = useParams<{ type: ToolkitType; id: string }>();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAdmin, loading: authLoading } = useAdminRole();

  const tableName = tableMap[type as ToolkitType];

  const [name, setName] = useState("");
  const [iconName, setIconName] = useState("Wrench");
  const [displayOrder, setDisplayOrder] = useState(0);

  const { data: item, isLoading } = useQuery({
    queryKey: [tableName, id],
    queryFn: async () => {
      if (isNew) return null;
      const { data, error } = await supabase
        .from(tableName as "toolkit_tools")
        .select("*")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !isNew && !!user && !!tableName,
  });

  useEffect(() => {
    if (item) {
      setName(item.name);
      setIconName(item.icon_name);
      setDisplayOrder(item.display_order);
    }
  }, [item]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = {
        name,
        icon_name: iconName,
        display_order: displayOrder,
      };

      if (isNew) {
        const { error } = await supabase.from(tableName as "toolkit_tools").insert(data);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from(tableName as "toolkit_tools")
          .update(data)
          .eq("id", id!);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
      queryClient.invalidateQueries({ queryKey: ["toolkit"] });
      toast({ title: isNew ? "Item created" : "Item updated" });
      navigate("/admin");
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const Icon = getIcon(iconName);

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

  const typeLabel = type === "tools" ? "Tool" : type === "methodologies" ? "Methodology" : "Skill";

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-2xl">
          <Button variant="ghost" onClick={() => navigate("/admin")} className="mb-6">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Admin
          </Button>

          <h1 className="font-display text-3xl font-bold mb-8">
            {isNew ? `Add ${typeLabel}` : `Edit ${typeLabel}`}
          </h1>

          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`${typeLabel} name`}
              />
            </div>

            <div>
              <Label htmlFor="icon">Icon</Label>
              <div className="flex items-center gap-3 mt-2">
                <div className="p-3 rounded-lg bg-card border border-border">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <Select value={iconName} onValueChange={setIconName}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {availableIcons.map((icon) => {
                      const IconComponent = getIcon(icon);
                      return (
                        <SelectItem key={icon} value={icon}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4" />
                            {icon}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
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

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending || !name}
                className="bg-gradient-primary hover:opacity-90"
              >
                {saveMutation.isPending ? "Saving..." : `Save ${typeLabel}`}
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

export default ToolkitItemEditor;
