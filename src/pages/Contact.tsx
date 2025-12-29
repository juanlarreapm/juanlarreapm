import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Linkedin, Send } from "lucide-react";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const { error } = await supabase.from("contact_submissions").insert({ name: formData.get("name") as string, email: formData.get("email") as string, message: formData.get("message") as string });
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
              <div><label className="text-sm font-medium mb-2 block">Name</label><Input name="name" required placeholder="Your name" /></div>
              <div><label className="text-sm font-medium mb-2 block">Email</label><Input name="email" type="email" required placeholder="your@email.com" /></div>
              <div><label className="text-sm font-medium mb-2 block">Message</label><Textarea name="message" required placeholder="Your message..." rows={5} /></div>
              <Button type="submit" disabled={loading} className="w-full bg-gradient-primary hover:opacity-90"><Send className="mr-2 w-4 h-4" />{loading ? "Sending..." : "Send Message"}</Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
