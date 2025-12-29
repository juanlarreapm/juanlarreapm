import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Linkedin, Send } from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be less than 2000 characters"),
});

const Contact = () => {
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
      const fieldErrors: { name?: string; email?: string; message?: string } = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof typeof fieldErrors;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("contact_submissions").insert([{ name: result.data.name, email: result.data.email, message: result.data.message }]);
    setLoading(false);
    if (error) { toast({ title: "Error", description: "Failed to send message.", variant: "destructive" }); return; }
    toast({ title: "Message sent!", description: "Thanks for reaching out. I'll get back to you soon." });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 text-center">Get in <span className="text-gradient">Touch</span></h1>
            <p className="text-xl text-muted-foreground text-center mb-12">I'd love to hear from you. Send me a message or connect on LinkedIn.</p>
            
            <div className="flex justify-center gap-4 mb-12">
              <a href="mailto:contact@juanlarrea.dev" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"><Mail className="w-5 h-5 text-primary" /><span className="text-sm">Email</span></a>
              <a href="https://www.linkedin.com/in/juanlarreapm/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"><Linkedin className="w-5 h-5 text-primary" /><span className="text-sm">LinkedIn</span></a>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-xl bg-card border border-border">
              <div>
                <label className="text-sm font-medium mb-2 block">Name</label>
                <Input name="name" placeholder="Your name" className={errors.name ? "border-destructive" : ""} />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input name="email" type="email" placeholder="your@email.com" className={errors.email ? "border-destructive" : ""} />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <Textarea name="message" placeholder="Your message..." rows={5} className={errors.message ? "border-destructive" : ""} />
                {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-gradient-primary hover:opacity-90"><Send className="mr-2 w-4 h-4" />{loading ? "Sending..." : "Send Message"}</Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
