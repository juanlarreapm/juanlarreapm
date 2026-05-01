import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import "@/styles/editorial-theme.css";

const Editorial = () => {
  const { data: caseStudies } = useQuery({
    queryKey: ["editorial-featured-case-studies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("published", true)
        .order("display_order", { ascending: true })
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  const { data: experiences } = useQuery({
    queryKey: ["editorial-experiences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const featured = caseStudies?.[0];
  const rest = caseStudies?.slice(1, 4) ?? [];

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="editorial-theme ed-grain">
      {/* Back to live site */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          to="/"
          className="ed-mono text-[11px] tracking-[0.16em] uppercase flex items-center gap-2 px-3 py-2 ed-hairline bg-[hsl(var(--ed-bg))]/90 backdrop-blur hover:ed-accent transition-colors"
          style={{ color: "hsl(var(--ed-ink))" }}
        >
          <ArrowLeft size={12} />
          Back to live site
        </Link>
      </div>
      <div className="fixed top-4 right-4 z-50 ed-mono text-[11px] tracking-[0.16em] uppercase px-3 py-2 ed-hairline bg-[hsl(var(--ed-bg))]/90 backdrop-blur" style={{ color: "hsl(var(--ed-accent))" }}>
        Editorial Preview · v1
      </div>

      {/* NAVBAR */}
      <header className="pt-24 pb-6 px-8 md:px-16 lg:px-24">
        <nav className="flex items-center justify-between">
          <a href="#top" className="ed-mono text-[12px] tracking-[0.22em] uppercase font-medium" style={{ color: "hsl(var(--ed-ink))" }}>
            Juan Larrea <span style={{ color: "hsl(var(--ed-ink-faint))" }}>— Product</span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            {[
              { name: "Work", id: "work" },
              { name: "About", id: "about" },
              { name: "Experience", id: "experience" },
              { name: "Contact", id: "contact" },
            ].map((l) => (
              <a key={l.id} href={`#${l.id}`} onClick={scrollTo(l.id)} className="ed-mono text-[11px] tracking-[0.18em] uppercase hover:underline underline-offset-4" style={{ color: "hsl(var(--ed-ink-muted))" }}>
                {l.name}
              </a>
            ))}
            <span className="flex items-center gap-2 ed-mono text-[11px] tracking-[0.18em] uppercase" style={{ color: "hsl(var(--ed-ink))" }}>
              <span className="ed-status-dot" /> Open to roles
            </span>
          </div>
        </nav>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="px-8 md:px-16 lg:px-24 pt-12 md:pt-20 pb-20 md:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 ed-rise">
              <div className="ed-label mb-8">№ 01 — Product Manager · 2017—2026</div>
              <h1 className="ed-display text-[56px] sm:text-[80px] md:text-[110px] lg:text-[140px]">
                I take<br />
                <span className="italic" style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144' }}>B2B SaaS</span><br />
                from <span className="ed-accent">0&nbsp;to&nbsp;1</span> —<br />
                then to scale.
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pt-32 ed-rise ed-delay-3">
              <div className="ed-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="ed-status-dot" />
                  <span className="ed-label" style={{ color: "hsl(var(--ed-ink))" }}>Currently</span>
                </div>
                <p className="ed-serif text-2xl leading-tight mb-4">
                  Shipping at <span className="ed-accent">PartsTech</span> — building tools that move millions in auto-parts commerce.
                </p>
                <a href="#contact" onClick={scrollTo("contact")} className="ed-mono text-[11px] tracking-[0.18em] uppercase inline-flex items-center gap-2 ed-link">
                  Hiring? Let's talk <ArrowUpRight size={12} />
                </a>
              </div>

              <p className="mt-8 ed-serif text-xl leading-snug" style={{ color: "hsl(var(--ed-ink-muted))" }}>
                Senior Product Manager. Eight years across five industries. I find the cheapest path to truth, then ship.
              </p>
            </div>
          </div>
        </section>

        {/* PROOF STRIP */}
        <section className="px-8 md:px-16 lg:px-24 ed-divider py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {[
              { n: "08", l: "Years in PM" },
              { n: "05", l: "Industries shipped" },
              { n: "12+", l: "Products launched" },
              { n: "$XXM", l: "ARR influenced" },
            ].map((m) => (
              <div key={m.l} className="flex flex-col gap-2">
                <span className="ed-metric text-6xl md:text-7xl">{m.n}</span>
                <span className="ed-label">{m.l}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SELECTED WORK */}
        <section id="work" className="px-8 md:px-16 lg:px-24 py-20 md:py-28">
          <div className="ed-rule mb-10">
            <span className="ed-label">№ 02 — Selected Work · 2019—2026</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Featured */}
            {featured && (
              <article className="lg:col-span-7 ed-card p-8 md:p-10 group cursor-pointer hover:-translate-y-1 transition-transform">
                <div className="flex items-center justify-between mb-8">
                  <span className="ed-num">01 · {featured.company}</span>
                  <ArrowUpRight size={20} style={{ color: "hsl(var(--ed-ink-faint))" }} className="group-hover:text-[hsl(var(--ed-accent))] transition-colors" />
                </div>
                <h3 className="ed-serif text-3xl md:text-5xl leading-[0.95] mb-6">{featured.title}</h3>
                <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: "hsl(var(--ed-ink-muted))" }}>
                  {featured.description}
                </p>
                {featured.metrics?.[0] && (
                  <div className="ed-divider pt-6 mt-8">
                    <div className="ed-label mb-2">Outcome</div>
                    <p className="ed-serif text-2xl md:text-3xl leading-tight">{featured.metrics[0]}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-8">
                  {featured.tags?.slice(0, 4).map((t: string) => (
                    <span key={t} className="ed-mono text-[10px] tracking-[0.14em] uppercase px-2 py-1 ed-hairline" style={{ color: "hsl(var(--ed-ink-muted))" }}>{t}</span>
                  ))}
                </div>
              </article>
            )}

            {/* Smaller cards */}
            <div className="lg:col-span-5 grid grid-cols-1 gap-6">
              {rest.map((cs, i) => (
                <article key={cs.id} className="ed-card p-6 md:p-8 group cursor-pointer hover:-translate-y-1 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <span className="ed-num">{String(i + 2).padStart(2, "0")} · {cs.company}</span>
                    <ArrowUpRight size={16} style={{ color: "hsl(var(--ed-ink-faint))" }} className="group-hover:text-[hsl(var(--ed-accent))] transition-colors" />
                  </div>
                  <h3 className="ed-serif text-2xl md:text-3xl leading-[1.0] mb-3">{cs.title}</h3>
                  {cs.metrics?.[0] && (
                    <p className="ed-serif text-base italic" style={{ color: "hsl(var(--ed-ink-muted))" }}>
                      {cs.metrics[0]}
                    </p>
                  )}
                </article>
              ))}
              {rest.length === 0 && (
                <div className="ed-card p-8 text-center ed-mono text-[11px] tracking-[0.18em] uppercase" style={{ color: "hsl(var(--ed-ink-faint))" }}>
                  More work loading…
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 flex justify-end">
            <Link to="/case-studies" className="ed-mono text-[11px] tracking-[0.18em] uppercase ed-link inline-flex items-center gap-2">
              View full archive <ArrowUpRight size={12} />
            </Link>
          </div>
        </section>

        {/* ABOUT / WHAT I DO */}
        <section id="about" className="px-8 md:px-16 lg:px-24 py-20 md:py-28 ed-divider">
          <div className="ed-rule mb-12">
            <span className="ed-label">№ 03 — What I do</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <h2 className="ed-serif text-4xl md:text-6xl leading-[0.98]">
                A PM who can <span className="italic ed-accent">build the thing</span>, sell it internally, and find the metric that matters.
              </h2>
            </div>
            <div className="lg:col-span-7">
              <ol className="space-y-10">
                {[
                  { n: "01", t: "0→1 product launches", d: "Ship the first version when no one knows what it should be yet. Comfortable with research, scrappy prototypes, and recovering from being wrong." },
                  { n: "02", t: "Growing B2B SaaS", d: "Funnel work, activation, retention loops. I read the data, talk to customers, and write the brief that gets engineering excited." },
                  { n: "03", t: "Cross-functional leadership", d: "Eight years pairing with engineers, designers, sales, and leadership. I translate, prioritize, and protect the team's focus." },
                  { n: "04", t: "Hands-on execution", d: "I prototype in Figma, write SQL, and ship docs that don't need a meeting. Low ego, high throughput." },
                ].map((row) => (
                  <li key={row.n} className="grid grid-cols-12 gap-4 ed-divider pt-6 first:border-t-0 first:pt-0">
                    <span className="col-span-2 md:col-span-1 ed-num pt-2">{row.n}</span>
                    <div className="col-span-10 md:col-span-11">
                      <h3 className="ed-serif text-2xl md:text-3xl mb-2">{row.t}</h3>
                      <p className="text-base leading-relaxed" style={{ color: "hsl(var(--ed-ink-muted))" }}>{row.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* EXPERIENCE TIMELINE */}
        <section id="experience" className="px-8 md:px-16 lg:px-24 py-20 md:py-28 ed-divider">
          <div className="ed-rule mb-12">
            <span className="ed-label">№ 04 — Experience</span>
          </div>

          <div className="space-y-0">
            {experiences?.map((exp: any, i) => (
              <div key={exp.id} className="grid grid-cols-12 gap-4 md:gap-8 py-8 ed-divider first:border-t-0 first:pt-0 group">
                <div className="col-span-12 md:col-span-3">
                  <span className="ed-mono text-[11px] tracking-[0.16em] uppercase" style={{ color: "hsl(var(--ed-ink-faint))" }}>
                    {exp.start_date || "—"} — {exp.end_date || "Present"}
                  </span>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="ed-serif text-2xl md:text-3xl leading-tight">{exp.company}</div>
                  <div className="ed-mono text-[11px] tracking-[0.16em] uppercase mt-1" style={{ color: "hsl(var(--ed-ink-muted))" }}>{exp.role}</div>
                </div>
                <div className="col-span-12 md:col-span-5">
                  <p className="text-base leading-relaxed" style={{ color: "hsl(var(--ed-ink-muted))" }}>
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
            {!experiences?.length && (
              <div className="ed-mono text-[11px] tracking-[0.18em] uppercase py-12" style={{ color: "hsl(var(--ed-ink-faint))" }}>
                Loading experience…
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="px-8 md:px-16 lg:px-24 py-28 md:py-40 ed-divider">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <div className="ed-label mb-8">№ 05 — Get in touch</div>
              <h2 className="ed-display text-5xl md:text-7xl lg:text-8xl">
                Hiring a PM<br />
                who has <span className="italic ed-accent">done this</span><br />
                before?
              </h2>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-4">
              <a href="mailto:juanlarreapm@gmail.com" className="ed-btn justify-center">
                Email me <ArrowUpRight size={14} />
              </a>
              <a href="https://www.linkedin.com/in/juanlarreapm/" target="_blank" rel="noopener noreferrer" className="ed-btn ed-btn-ghost justify-center">
                LinkedIn <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="px-8 md:px-16 lg:px-24 py-10 ed-divider flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="ed-mono text-[11px] tracking-[0.16em] uppercase" style={{ color: "hsl(var(--ed-ink-muted))" }}>
            © {new Date().getFullYear()} Juan Larrea · Product Manager
          </div>
          <div className="flex gap-6">
            {[
              { name: "Email", href: "mailto:juanlarreapm@gmail.com" },
              { name: "LinkedIn", href: "https://www.linkedin.com/in/juanlarreapm/" },
              { name: "GitHub", href: "https://github.com/juanlarreapm" },
            ].map((l) => (
              <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className="ed-mono text-[11px] tracking-[0.16em] uppercase ed-link">
                {l.name}
              </a>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Editorial;
