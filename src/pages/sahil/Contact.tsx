import { SahilLayout } from "@/components/sahil/SahilLayout";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send } from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const SahilContact = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };
    const result = contactSchema.safeParse(data);
    if (!result.success) {
      const fe: typeof errors = {};
      result.error.errors.forEach((er) => { fe[er.path[0] as keyof typeof errors] = er.message; });
      setErrors(fe);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_submissions").insert([result.data]);
    if (error) {
      setLoading(false);
      toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
      return;
    }
    supabase.functions.invoke("notify-contact", { body: result.data }).catch((err) => console.error(err));
    setLoading(false);
    toast({ title: "Message sent.", description: "Thanks for reaching out — I'll get back to you soon." });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <SahilLayout>
      <section className="mb-12">
        <p className="sh-section-label">say hi</p>
        <h1 className="sh-title mb-6">Drop me a line.</h1>
        <p className="sh-hero mb-2">
          The fastest way to reach me is{" "}
          <a href="mailto:juanlarreapm@gmail.com" className="sh-link">email</a> or{" "}
          <a href="https://www.linkedin.com/in/juanlarreapm/" target="_blank" rel="noopener noreferrer" className="sh-link">LinkedIn</a>.
        </p>
        <p className="sh-hero">Or use this if it's easier:</p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="sh-label">name</label>
          <input name="name" placeholder="your name" className="sh-field" />
          {errors.name && <p className="sh-chip mt-1" style={{ color: "hsl(var(--destructive))" }}>{errors.name}</p>}
        </div>
        <div>
          <label className="sh-label">email</label>
          <input name="email" type="email" placeholder="you@somewhere.com" className="sh-field" />
          {errors.email && <p className="sh-chip mt-1" style={{ color: "hsl(var(--destructive))" }}>{errors.email}</p>}
        </div>
        <div>
          <label className="sh-label">message</label>
          <textarea name="message" placeholder="what's on your mind?" rows={5} className="sh-field" />
          {errors.message && <p className="sh-chip mt-1" style={{ color: "hsl(var(--destructive))" }}>{errors.message}</p>}
        </div>
        <button type="submit" disabled={loading} className="sh-button">
          <Send size={14} /> {loading ? "sending…" : "send"}
        </button>
      </form>
    </SahilLayout>
  );
};

export default SahilContact;
