import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useToolkitVisible() {
  const { data } = useQuery({
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
    staleTime: 1000 * 60 * 5,
  });
  // default to visible if unset
  return data?.value !== "false";
}
