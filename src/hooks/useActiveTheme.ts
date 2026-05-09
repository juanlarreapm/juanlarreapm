import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ActiveTheme = "b2b" | "sahil";

export function useActiveTheme(): ActiveTheme {
  const { data } = useQuery({
    queryKey: ["site_settings", "active_theme"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "active_theme")
        .maybeSingle();
      if (error) throw error;
      return data?.value as ActiveTheme | undefined;
    },
    staleTime: 60_000,
  });
  return data === "sahil" ? "sahil" : "b2b";
}
