import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import "@/styles/swiss-theme.css";

const Swiss = () => {
  const { data: caseStudies } = useQuery({
    queryKey: ["swiss-case-studies"],
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
    queryKey: ["swiss-experiences"],
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
    <div className="swiss-theme">
      {/* Back to live + preview marker */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          to="/"
          className="sw-mono flex items-center gap-2 px-3 py-2 border border-current bg-[hsl(var(--sw-bg))]"
          style={{ color: "hsl(var(--sw-ink))" }}
        >
          <ArrowLeft size={11} />
          Back to live site
        </Link>
      </div>
      <div
        className="fixed top-4 right-4 z-50 sw-mono px-3 py-2 border bg-[hsl(var(--sw-bg))]"
        style={{ color: "hsl(var(--sw-accent))", borderColor: "hsl(var(--sw-accent))" }}
      >
        <span className="sw-marker mr-2 align-middle" />
        Swiss Preview · v1
      </div>

      {/* TOP BAR */}
      <header className="pt-24 px-6 md:px-12">
        <div className="sw-rule pt-3 pb-3 flex items-center justify-between">
          <a href="#top" className="sw-label" style={{ color: "hsl(var(--sw-ink))" }}>
            Juan&nbsp;Larrea / Product&nbsp;Manager
          </a>
          <nav className="hidden md:flex items-center gap-7">
            {[
              { name: "§01 Index", id: "top" },
              { name: "§02 Work", id: "work" },
              { name: "§03 Praxis", id: "praxis" },
              { name: "§04 CV", id: "cv" },
              { name: "§05 Contact", id: "contact" },
            ].map((l) => (
              <a key={l.id} href={`#${l.id}`} onClick={scrollTo(l.id)} className="sw-mono hover:sw-accent transition-colors" style={{ color: "hsl(var(--sw-ink))" }}>
                {l.name}
              </a>
            ))}
          </nav>
          <span className="sw-mono flex items-center gap-2" style={{ color: "hsl(var(--sw-ink))" }}>
            <span className="sw-marker sw-blink" /> Available Q3 2026
          </span>
        </div>
      </header>

      <main id="top" className="px-6 md:px-12">
        {/* HERO — §01 */}
        <section className="pt-12 pb-10">
          <div className="grid grid-cols-12 gap-4 sw-rule pt-4">
            <div className="col-span-12 md:col-span-9 sw-rise">
              <div className="sw-meta mb-6">§01 — Manifesto · Filed 2026</div>
              <h1 className="sw-display text-[15vw] md:text-[13vw] lg:text-[12vw]">
                B2B SAAS<br />
                PRODUCT<br />
                MANAGER<br />
                WHO <span className="sw-accent">SHIPS.</span>
              </h1>
            </div>
            <aside className="col-span-12 md:col-span-3 md:border-l md:pl-6 sw-rise sw-d2" style={{ borderColor: "hsl(var(--sw-line))" }}>
              <div className="space-y-5">
                <div>
                  <div className="sw-mono mb-1" style={{ color: "hsl(var(--sw-ink-faint))" }}>Location</div>
                  <div className="sw-mono" style={{ color: "hsl(var(--sw-ink))" }}>NYC / Remote</div>
                </div>
                <div>
                  <div className="sw-mono mb-1" style={{ color: "hsl(var(--sw-ink-faint))" }}>Currently</div>
                  <div className="sw-mono" style={{ color: "hsl(var(--sw-ink))" }}>Sr. PM, PartsTech</div>
                </div>
                <div>
                  <div className="sw-mono mb-1" style={{ color: "hsl(var(--sw-ink-faint))" }}>Specialty</div>
                  <div className="sw-mono" style={{ color: "hsl(var(--sw-ink))" }}>0→1 · Growth · B2B</div>
                </div>
                <div>
                  <div className="sw-mono mb-1" style={{ color: "hsl(var(--sw-ink-faint))" }}>Status</div>
                  <div className="sw-mono sw-accent">Open to roles</div>
                </div>
                <div className="pt-4 border-t" style={{ borderColor: "hsl(var(--sw-line))" }}>
                  <p className="text-[13px] leading-relaxed" style={{ color: "hsl(var(--sw-ink-muted))" }}>
                    Senior PM. Eight years across five industries. I find the cheapest path to truth, then ship the thing.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* PROOF STRIP */}
        <section className="grid grid-cols-2 md:grid-cols-4 sw-rule sw-divide-x">
          {[
            { n: "08", l: "Years / PM" },
            { n: "05", l: "Industries" },
            { n: "12+", l: "Launches" },
            { n: "$XXM", l: "ARR Influenced" },
          ].map((m, i) => (
            <div key={m.l} className="p-6 md:p-8">
              <div className="sw-mono mb-3" style={{ color: "hsl(var(--sw-ink-faint))" }}>0{i + 1} ——</div>
              <div className="sw-display text-5xl md:text-7xl">{m.n}</div>
              <div className="sw-mono mt-3" style={{ color: "hsl(var(--sw-ink-muted))" }}>{m.l}</div>
            </div>
          ))}
        </section>

        {/* §02 — WORK */}
        <section id="work" className="pt-20 pb-8">
          <div className="grid grid-cols-12 gap-4 sw-rule pt-4 mb-8">
            <div className="col-span-12 md:col-span-9">
              <div className="sw-meta mb-3">§02 — Selected Work</div>
              <h2 className="sw-display text-5xl md:text-7xl">Things <span className="sw-accent">shipped.</span></h2>
            </div>
            <div className="col-span-12 md:col-span-3 md:text-right">
              <Link to="/case-studies" className="sw-mono sw-link">View full archive →</Link>
            </div>
          </div>

          <div className="sw-rule">
            {caseStudies?.map((cs: any, i) => (
              <article
                key={cs.id}
                className="grid grid-cols-12 gap-4 py-7 sw-rule-thin group cursor-pointer"
              >
                <div className="col-span-12 md:col-span-1 sw-mono pt-2" style={{ color: "hsl(var(--sw-ink-faint))" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="sw-display text-2xl md:text-3xl group-hover:sw-accent transition-colors">
                    {cs.title}
                  </div>
                  <div className="sw-mono mt-2" style={{ color: "hsl(var(--sw-ink-muted))" }}>
                    {cs.company}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-5">
                  <p className="text-[14px] leading-relaxed" style={{ color: "hsl(var(--sw-ink-muted))" }}>
                    {cs.description}
                  </p>
                  {cs.metrics?.[0] && (
                    <div className="sw-mono mt-3 inline-block px-2 py-1" style={{ background: "hsl(var(--sw-ink))", color: "hsl(var(--sw-bg))" }}>
                      {cs.metrics[0]}
                    </div>
                  )}
                </div>
                <div className="col-span-12 md:col-span-2 md:text-right flex md:justify-end items-start">
                  <ArrowUpRight size={22} className="group-hover:sw-accent transition-colors" style={{ color: "hsl(var(--sw-ink))" }} />
                </div>
              </article>
            ))}
            {!caseStudies?.length && (
              <div className="sw-mono py-8" style={{ color: "hsl(var(--sw-ink-faint))" }}>Loading work…</div>
            )}
          </div>
        </section>

        {/* §03 — PRAXIS */}
        <section id="praxis" className="pt-20 pb-8">
          <div className="grid grid-cols-12 gap-4 sw-rule pt-4">
            <div className="col-span-12 md:col-span-5">
              <div className="sw-meta mb-3">§03 — Praxis</div>
              <h2 className="sw-display text-5xl md:text-7xl">
                What I <span className="sw-accent">actually</span> do.
              </h2>
            </div>
            <ol className="col-span-12 md:col-span-7 mt-8 md:mt-0">
              {[
                { n: "01", t: "0→1 launches", d: "Ship the first version when no one knows what it should be. Comfortable with research, scrappy prototypes, and being wrong fast." },
                { n: "02", t: "B2B SaaS growth", d: "Activation, retention, expansion. I read the data, talk to customers, and write the brief that gets engineering excited." },
                { n: "03", t: "Cross-functional leadership", d: "Eight years pairing with engineers, designers, sales, and execs. I translate, prioritize, and protect focus." },
                { n: "04", t: "Hands-on execution", d: "I prototype in Figma, write SQL, and ship docs that don't need a meeting. Low ego, high throughput." },
              ].map((row) => (
                <li key={row.n} className="grid grid-cols-12 gap-4 py-6 sw-rule-thin">
                  <div className="col-span-2 md:col-span-1 sw-mono pt-2" style={{ color: "hsl(var(--sw-ink-faint))" }}>
                    {row.n}
                  </div>
                  <div className="col-span-10 md:col-span-11">
                    <div className="sw-display text-2xl md:text-3xl mb-2">{row.t}</div>
                    <p className="text-[14px] leading-relaxed" style={{ color: "hsl(var(--sw-ink-muted))" }}>{row.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* §04 — CV */}
        <section id="cv" className="pt-20 pb-8">
          <div className="grid grid-cols-12 gap-4 sw-rule pt-4 mb-6">
            <div className="col-span-12 md:col-span-9">
              <div className="sw-meta mb-3">§04 — Curriculum Vitae</div>
              <h2 className="sw-display text-5xl md:text-7xl">Eight years. <span className="sw-accent">No fluff.</span></h2>
            </div>
            <div className="col-span-12 md:col-span-3 md:text-right">
              <a href="/about" className="sw-mono sw-link">Long-form CV →</a>
            </div>
          </div>

          <div className="sw-rule">
            {experiences?.map((exp: any) => (
              <div key={exp.id} className="grid grid-cols-12 gap-4 py-6 sw-rule-thin">
                <div className="col-span-12 md:col-span-2 sw-mono" style={{ color: "hsl(var(--sw-ink-faint))" }}>
                  {exp.start_date || "—"} → {exp.end_date || "Present"}
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="sw-display text-xl md:text-2xl">{exp.company}</div>
                  <div className="sw-mono mt-1" style={{ color: "hsl(var(--sw-ink-muted))" }}>{exp.role}</div>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <p className="text-[14px] leading-relaxed" style={{ color: "hsl(var(--sw-ink-muted))" }}>
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
            {!experiences?.length && (
              <div className="sw-mono py-8" style={{ color: "hsl(var(--sw-ink-faint))" }}>Loading CV…</div>
            )}
          </div>
        </section>

        {/* §05 — CONTACT */}
        <section id="contact" className="pt-24 pb-20">
          <div className="grid grid-cols-12 gap-4 sw-rule pt-4">
            <div className="col-span-12 md:col-span-8">
              <div className="sw-meta mb-4">§05 — Contact</div>
              <h2 className="sw-display text-6xl md:text-8xl lg:text-9xl">
                HIRING<br />
                <span className="sw-accent">A&nbsp;PM?</span>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-4 flex flex-col gap-3 md:pt-12">
              <a href="mailto:juanlarreapm@gmail.com" className="sw-btn">
                Email <ArrowUpRight size={14} />
              </a>
              <a href="https://www.linkedin.com/in/juanlarreapm/" target="_blank" rel="noopener noreferrer" className="sw-btn sw-btn-ghost">
                LinkedIn <ArrowUpRight size={14} />
              </a>
              <a href="/case-studies" className="sw-btn sw-btn-ghost">
                Case studies <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </section>

        {/* COLOPHON / FOOTER */}
        <footer className="sw-rule py-8 grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4 sw-mono" style={{ color: "hsl(var(--sw-ink-muted))" }}>
            © {new Date().getFullYear()} Juan Larrea
          </div>
          <div className="col-span-12 md:col-span-4 sw-mono" style={{ color: "hsl(var(--sw-ink-muted))" }}>
            Set in Inter / JetBrains Mono · 12-col grid
          </div>
          <div className="col-span-12 md:col-span-4 md:text-right flex md:justify-end gap-5">
            {[
              { name: "Email", href: "mailto:juanlarreapm@gmail.com" },
              { name: "LinkedIn", href: "https://www.linkedin.com/in/juanlarreapm/" },
              { name: "GitHub", href: "https://github.com/juanlarreapm" },
            ].map((l) => (
              <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className="sw-mono sw-link">
                {l.name}
              </a>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Swiss;
