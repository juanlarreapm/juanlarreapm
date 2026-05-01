import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import "@/styles/quiet-theme.css";

const Quiet = () => {
  const { data: caseStudies } = useQuery({
    queryKey: ["quiet-case-studies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("published", true)
        .order("display_order", { ascending: true })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  const { data: experiences } = useQuery({
    queryKey: ["quiet-experiences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="quiet-theme">
      {/* Preview chrome */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          to="/"
          className="qt-meta inline-flex items-center gap-2 px-3 py-2 rounded-full border bg-[hsl(var(--qt-bg))]/80 backdrop-blur"
          style={{ color: "hsl(var(--qt-ink))", borderColor: "hsl(var(--qt-line))" }}
        >
          <ArrowLeft size={12} />
          Back to live site
        </Link>
      </div>
      <div
        className="fixed top-4 right-4 z-50 qt-meta inline-flex items-center gap-2 px-3 py-2 rounded-full border bg-[hsl(var(--qt-bg))]/80 backdrop-blur"
        style={{ color: "hsl(var(--qt-accent))", borderColor: "hsl(var(--qt-line))" }}
      >
        <span className="qt-dot" />
        Quiet Preview · v1
      </div>

      {/* Top minimal nav */}
      <header className="pt-24 pb-4">
        <div className="max-w-[640px] mx-auto px-6 flex items-center justify-between">
          <a href="#top" className="qt-meta" style={{ color: "hsl(var(--qt-ink))" }}>
            Juan Larrea
          </a>
          <nav className="flex gap-6">
            {[
              { name: "Work", id: "work" },
              { name: "About", id: "about" },
              { name: "CV", id: "cv" },
              { name: "Contact", id: "contact" },
            ].map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={scrollTo(l.id)}
                className="qt-meta hover:text-[hsl(var(--qt-ink))] transition-colors"
              >
                {l.name}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="top" className="max-w-[640px] mx-auto px-6">
        {/* HERO */}
        <section className="pt-32 pb-40 qt-fade">
          <div className="qt-meta mb-8 inline-flex items-center gap-2">
            <span className="qt-dot" />
            <span>Open to new roles</span>
          </div>
          <h1 className="qt-display text-5xl md:text-6xl mb-10">
            Juan Larrea.
          </h1>
          <p className="qt-display text-2xl md:text-[28px] leading-[1.35] mb-10" style={{ fontWeight: 300 }}>
            Senior PM helping{" "}
            <span style={{ color: "hsl(var(--qt-ink))" }}>B2B SaaS</span>{" "}
            companies go from{" "}
            <span className="qt-accent">zero to one</span>, then grow it.
          </p>
          <p className="qt-body text-base mb-12">
            Eight years. Five industries. I find the cheapest path to truth,
            then ship the thing.
          </p>
          <a href="#work" onClick={scrollTo("work")} className="qt-link qt-meta inline-flex items-center gap-2" style={{ color: "hsl(var(--qt-ink))" }}>
            Currently shipping at PartsTech
            <ArrowUpRight size={14} />
          </a>
        </section>

        {/* PROOF — quiet, inline */}
        <section className="pb-40 qt-divider pt-10">
          <div className="grid grid-cols-2 gap-y-10 gap-x-8">
            {[
              { n: "8", l: "years in product" },
              { n: "5", l: "industries shipped" },
              { n: "12+", l: "products launched" },
              { n: "$XXM", l: "ARR influenced" },
            ].map((m) => (
              <div key={m.l}>
                <div className="qt-display text-4xl md:text-5xl mb-2" style={{ fontWeight: 300 }}>
                  {m.n}
                </div>
                <div className="qt-meta">{m.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* WORK */}
        <section id="work" className="pb-40">
          <div className="mb-10">
            <div className="qt-meta mb-3">Selected work</div>
            <h2 className="qt-display text-3xl md:text-4xl">Things shipped.</h2>
          </div>
          <div>
            {caseStudies?.map((cs: any) => (
              <a
                key={cs.id}
                href="#"
                className="qt-row block cursor-pointer no-underline"
                style={{ color: "hsl(var(--qt-ink))" }}
              >
                <div className="qt-meta">{cs.start_year || ""}</div>
                <div>
                  <div className="text-base md:text-lg" style={{ fontWeight: 500 }}>
                    {cs.title}
                  </div>
                  <div className="qt-meta mt-1">
                    {cs.company}
                    {cs.metrics?.[0] ? ` · ${cs.metrics[0]}` : ""}
                  </div>
                </div>
                <ArrowUpRight size={16} style={{ color: "hsl(var(--qt-ink-faint))" }} />
              </a>
            ))}
            {!caseStudies?.length && (
              <div className="qt-meta py-6">Loading work…</div>
            )}
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="pb-40">
          <div className="qt-meta mb-3">About</div>
          <h2 className="qt-display text-3xl md:text-4xl mb-8">
            A PM who can build the thing, sell it internally,
            and find the metric that matters.
          </h2>
          <div className="space-y-6">
            <p className="qt-body">
              I've spent eight years shipping software across five industries —
              from auto-parts commerce to retail, education tech, and consumer
              loyalty. The throughline: zero-to-one launches and the unglamorous
              growth work that comes after.
            </p>
            <p className="qt-body">
              I prototype in Figma, write SQL, run customer interviews, and
              write briefs that don't need a follow-up meeting. Low ego,
              high throughput, allergic to theater.
            </p>
          </div>
        </section>

        {/* CV */}
        <section id="cv" className="pb-40">
          <div className="mb-10">
            <div className="qt-meta mb-3">Experience</div>
            <h2 className="qt-display text-3xl md:text-4xl">Where I've worked.</h2>
          </div>
          <div>
            {experiences?.map((exp: any) => (
              <div key={exp.id} className="qt-row" style={{ gridTemplateColumns: "100px 1fr" }}>
                <div className="qt-meta">
                  {exp.start_date || "—"} – {exp.end_date || "Now"}
                </div>
                <div>
                  <div className="text-base md:text-lg" style={{ fontWeight: 500, color: "hsl(var(--qt-ink))" }}>
                    {exp.company}
                  </div>
                  <div className="qt-meta mt-1">{exp.role}</div>
                  {exp.description && (
                    <p className="qt-body text-[15px] mt-3">{exp.description}</p>
                  )}
                </div>
              </div>
            ))}
            {!experiences?.length && (
              <div className="qt-meta py-6">Loading experience…</div>
            )}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="pb-40">
          <div className="qt-meta mb-3">Contact</div>
          <h2 className="qt-display text-3xl md:text-4xl mb-8">
            Hiring a PM who's done this before?
          </h2>
          <p className="qt-body mb-8">
            The fastest way to reach me is email. I reply within a day.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:juanlarreapm@gmail.com" className="qt-btn">
              Email me <ArrowUpRight size={14} />
            </a>
            <a
              href="https://www.linkedin.com/in/juanlarreapm/"
              target="_blank"
              rel="noopener noreferrer"
              className="qt-btn qt-btn-ghost"
            >
              LinkedIn <ArrowUpRight size={14} />
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="qt-divider py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="qt-meta">
            © {new Date().getFullYear()} Juan Larrea
          </div>
          <div className="flex gap-6">
            {[
              { name: "Email", href: "mailto:juanlarreapm@gmail.com" },
              { name: "LinkedIn", href: "https://www.linkedin.com/in/juanlarreapm/" },
              { name: "GitHub", href: "https://github.com/juanlarreapm" },
            ].map((l) => (
              <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className="qt-meta qt-link">
                {l.name}
              </a>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Quiet;
