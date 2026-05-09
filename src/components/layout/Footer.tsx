import { Link } from "react-router-dom";
import { Linkedin, Mail, Github } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToolkitVisible } from "@/hooks/useToolkitVisible";

const allNavLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "Toolkit", href: "/toolkit" },
  { name: "Lab", href: "/lab" },
  { name: "Contact", href: "/contact" },
];

const blogLink = { name: "Blog", href: "/blog" };

const socialLinks = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/juanlarreapm/", icon: Linkedin },
  { name: "GitHub", href: "https://github.com/juanlarreapm", icon: Github },
  { name: "Email", href: "mailto:juanlarreapm@gmail.com", icon: Mail },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  const { data: blogVisibilitySetting } = useQuery({
    queryKey: ["site_settings", "blog_visible"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").eq("key", "blog_visible").maybeSingle();
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const isBlogVisible = blogVisibilitySetting?.value === "true";
  const isToolkitVisible = useToolkitVisible();

  const baseNavLinks = isToolkitVisible ? allNavLinks : allNavLinks.filter((l) => l.href !== "/toolkit");
  const contactIdx = baseNavLinks.findIndex((l) => l.href === "/contact");
  const navLinks = isBlogVisible
    ? [...baseNavLinks.slice(0, contactIdx), blogLink, baseNavLinks[contactIdx]]
    : baseNavLinks;

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="font-display font-bold text-2xl text-gradient">
              Juan Larrea
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              Senior Product Manager passionate about building cool things with cool people.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Navigation</h4>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Connect</h4>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all hover-glow"
                  aria-label={link.name}
                >
                  <link.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© {currentYear} Juan Larrea. All rights reserved.</p>
          <div className="text-sm text-muted-foreground text-center md:text-right">
            <p className="flex items-center justify-center md:justify-end gap-1">
              Made with <span className="heart-pulse text-destructive cursor-pointer">❤️</span> and lots of ☕
            </p>
            <span className="text-xs opacity-50 hidden sm:inline">(psst... try the classic code)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
