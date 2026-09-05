import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ActiveTheme = "b2b" | "sahil";

const STORAGE_KEY = "active_theme_cache";
export const DEFAULT_THEME: ActiveTheme = "sahil";

export function hasCachedTheme(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "sahil" || v === "b2b";
  } catch {
    return false;
  }
}

function readCachedTheme(): ActiveTheme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "sahil" ? "sahil" : v === "b2b" ? "b2b" : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function useActiveThemeState(): { theme: ActiveTheme; isResolved: boolean } {
  const { data, isFetched } = useQuery({
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

  return {
    theme: data === "sahil" ? "sahil" : "b2b",
    isResolved: isFetched || hasCachedTheme(),
  };
}

export function useActiveTheme(): ActiveTheme {
  return useActiveThemeState().theme;
}
