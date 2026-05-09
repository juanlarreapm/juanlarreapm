import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ActiveTheme = "b2b" | "sahil";

const STORAGE_KEY = "active_theme_cache";

function readCachedTheme(): ActiveTheme {
  if (typeof window === "undefined") return "b2b";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "sahil" ? "sahil" : v === "b2b" ? "b2b" : "b2b";
}

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
      const theme: ActiveTheme = data?.value === "sahil" ? "sahil" : "b2b";
      try {
        window.localStorage.setItem(STORAGE_KEY, theme);
      } catch {}
      return theme;
    },
    staleTime: 60_000,
    initialData: readCachedTheme,
    initialDataUpdatedAt: 0,
  });
  return data === "sahil" ? "sahil" : "b2b";
}
