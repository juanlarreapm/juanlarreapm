import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Linkedin, Github } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import "@/styles/sahil-theme.css";

const Sahil = () => {
  const { data: caseStudies } = useQuery({
    queryKey: ["sahil-case-studies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("published", true)
        .order("display_order", { ascending: true })
        .limit(8);
      if (error) throw error;
      return data;
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["sahil-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  const year = (d?: string | null) =>
    d ? new Date(d).getFullYear().toString() : "—";

  return (
    <div className="sahil-theme">
      {/* Preview chrome */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          to="/"
          className="sh-chip inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            background: "hsl(var(--sh-bg) / 0.9)",
            border: "1px solid hsl(var(--sh-line))",
            backdropFilter: "blur(6px)",
          }}
        >
          <ArrowLeft size={12} />
          Back to live site
        </Link>
      </div>
      <div
        className="fixed top-4 right-4 z-50 sh-chip inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
        style={{
          background: "hsl(var(--sh-bg) / 0.9)",
          border: "1px solid hsl(var(--sh-line))",
          color: "hsl(var(--sh-accent))",
          backdropFilter: "blur(6px)",
        }}
      >
        Sahil Preview · v1
      </div>

      <main className="max-w-[720px] mx-auto px-6 pt-28 pb-24 sh-fade">
        {/* Header: name left, nav right, all on top */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-16">
          <div className="flex items-center gap-3">
            <span className="sh-avatar-fallback">JL</span>
            <span className="sh-name">Juan Larrea</span>
          </div>
          <nav>
            <ul
              className="sh-body flex flex-wrap gap-x-5 gap-y-2"
              style={{ listStyle: "none", padding: 0, margin: 0 }}
            >
              <li><a href="/about" className="sh-link">about</a></li>
              <li><a href="/case-studies" className="sh-link">work</a></li>
              <li><a href="/blog" className="sh-link">writing</a></li>
              <li><a href="/lab" className="sh-link">lab</a></li>
              <li><a href="/toolkit" className="sh-link">toolkit</a></li>
              <li><a href="mailto:juanlarreapm@gmail.com" className="sh-link">email</a></li>
              <li><a href="https://www.linkedin.com/in/juanlarreapm/" target="_blank" rel="noopener noreferrer" className="sh-link">linkedin</a></li>
              <li><a href="https://github.com/juanlarreapm" target="_blank" rel="noopener noreferrer" className="sh-link">github</a></li>
            </ul>
          </nav>
        </header>

        {/* Hero — single column letter */}
        <section className="mb-20">
          <p className="sh-hero mb-6">
            I'm Juan. I'm a <span className="sh-accent">senior product manager</span> helping
            B2B SaaS companies go from zero to one — then grow it. I've shipped twelve
            products across five industries over the last eight years.
          </p>
          <p className="sh-hero mb-6">
            Right now I'm at{" "}
            <a
              href="https://partstech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="sh-link"
            >
              PartsTech
            </a>
            , rebuilding how shops buy parts. Before that: retail at Nordstrom, edtech at
            Intellum, and consumer loyalty at INWEGO and Merchants Preferred.
          </p>
          <p className="sh-hero">
            I write occasionally about <a href="/blog" className="sh-link">product, taste, and shipping</a>.
            If you're hiring a PM who can build the thing, sell it internally, and find
            the metric that matters —{" "}
            <a href="mailto:juanlarreapm@gmail.com" className="sh-link">say hi</a>.
          </p>
        </section>

        {/* Signature */}
        <section className="mb-12">
          <div className="sh-signature">— juan</div>
        </section>

        <hr className="sh-rule mb-6" />
        <footer className="sh-chip">
          © {new Date().getFullYear()} · written, designed, and shipped from a small desk.
        </footer>
      </main>
    </div>
  );
};

export default Sahil;
