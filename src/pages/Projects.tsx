import { Layout } from "@/components/layout/Layout";

const projects = [
  { title: "EstimateXpress", company: "PartsTech", description: "Led 0-to-1 launch of an estimating tool for auto repair shops. Managed full product lifecycle from discovery to launch.", metrics: ["500+ shops onboarded Year 1", "First-to-market product"], tags: ["0-to-1", "B2B SaaS", "Growth"] },
  { title: "Jobs Feature", company: "PartsTech", description: "Designed job management system transforming parts ordering workflow.", metrics: ["10% cart size increase", "Improved retention"], tags: ["Feature Dev", "UX", "Analytics"] },
  { title: "Funnel Optimization", company: "INWEGO", description: "Comprehensive redesign of conversion funnel for travel insurance platform.", metrics: ["51% conversion increase", "Major revenue impact"], tags: ["Growth", "A/B Testing", "Conversion"] },
  { title: "E-commerce Initiatives", company: "Nordstrom", description: "Led enterprise e-commerce product initiatives for major retailer.", metrics: ["Cross-functional leadership", "Enterprise scale"], tags: ["E-commerce", "Enterprise", "Strategy"] },
  { title: "Learning Platform", company: "Intellum", description: "Built features for B2B learning management platform.", metrics: ["Platform engagement", "Enterprise clients"], tags: ["B2B SaaS", "EdTech", "Features"] },
];

const Projects = () => {
  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">My <span className="text-gradient">Projects</span></h1>
            <p className="text-xl text-muted-foreground">A collection of impactful products I've built throughout my career.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {projects.map((project, i) => (
              <article key={i} className="p-6 rounded-xl bg-card border border-border card-hover">
                <span className="text-xs text-primary font-medium uppercase tracking-wider">{project.company}</span>
                <h3 className="font-display text-xl font-semibold mt-1 mb-3">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                <ul className="space-y-2 mb-4">{project.metrics.map((m, j) => <li key={j} className="text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" />{m}</li>)}</ul>
                <div className="flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="px-2 py-1 text-xs rounded-md bg-secondary text-muted-foreground">{tag}</span>)}</div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
