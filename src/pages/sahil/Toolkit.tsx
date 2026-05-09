import { SahilLayout } from "@/components/sahil/SahilLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const SahilToolkit = () => {
  const { data: tools } = useQuery({
    queryKey: ["sahil-toolkit-tools"],
    queryFn: async () => (await supabase.from("toolkit_tools").select("*").order("display_order")).data,
  });
  const { data: methodologies } = useQuery({
    queryKey: ["sahil-toolkit-methodologies"],
    queryFn: async () => (await supabase.from("toolkit_methodologies").select("*").order("display_order")).data,
  });
  const { data: skills } = useQuery({
    queryKey: ["sahil-toolkit-skills"],
    queryFn: async () => (await supabase.from("toolkit_skills").select("*").order("display_order")).data,
  });

  return (
    <SahilLayout>
      <section className="mb-12">
        <p className="sh-section-label">toolkit</p>
        <h1 className="sh-title mb-6">What I work with.</h1>
        <p className="sh-hero">A short list of tools, methods, and skills I keep close at hand.</p>
      </section>

      <section className="mb-10">
        <p className="sh-section-label">skills</p>
        <p className="sh-body">{skills?.map((s) => s.name).join(" · ") || "—"}</p>
      </section>

      <section className="mb-10">
        <p className="sh-section-label">tools</p>
        <p className="sh-body">{tools?.map((t) => t.name).join(" · ") || "—"}</p>
      </section>

      <section className="mb-10">
        <p className="sh-section-label">methodologies</p>
        <p className="sh-body">{methodologies?.map((m) => m.name).join(" · ") || "—"}</p>
      </section>
    </SahilLayout>
  );
};

export default SahilToolkit;
