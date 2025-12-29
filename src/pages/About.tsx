import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, Briefcase, Wrench, GitBranch, Lightbulb } from "lucide-react";

const experiences = [
  { company: "PartsTech", role: "Senior Product Manager", period: "2022 - Present", highlights: ["Led EstimateXpress 0-to-1 launch", "500+ shops onboarded", "10% cart size increase with Jobs feature"] },
  { company: "Nordstrom", role: "Product Manager", period: "2021 - 2022", highlights: ["Enterprise e-commerce initiatives", "Cross-functional leadership"] },
  { company: "Intellum", role: "Product Manager", period: "2019 - 2021", highlights: ["Learning platform features", "B2B SaaS experience"] },
  { company: "INWEGO", role: "Product Manager", period: "2017 - 2019", highlights: ["51% conversion increase", "Funnel optimization"] },
  { company: "Merchants Preferred", role: "Associate PM", period: "2015 - 2017", highlights: ["Payment solutions", "Early PM experience"] },
];

const tools = ["Jira", "Confluence", "Figma", "Amplitude", "Mixpanel", "Looker", "SQL", "Notion", "Miro", "Google Analytics", "Tableau"];

const methodologies = ["Scrum", "Agile", "Kanban", "Design Thinking", "Lean Startup", "OKRs", "A/B Testing", "Jobs-to-be-Done"];

const skills = ["Product Strategy", "Roadmap Planning", "User Story Writing", "Customer Interviewing", "User Research", "Stakeholder Management", "Data Analysis", "Cross-functional Leadership", "0-to-1 Launches", "Growth Optimization"];

const About = () => {
  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">About <span className="text-gradient">Me</span></h1>
            <p className="text-xl text-muted-foreground mb-8">Senior Product Manager with 8+ years of experience building impactful products across B2B SaaS, e-commerce, and travel industries.</p>
            <Button asChild className="bg-gradient-primary hover:opacity-90"><a href="#"><Download className="mr-2 w-4 h-4" />Download Resume</a></Button>
          </div>

          <div className="max-w-4xl mx-auto mt-20">
            <h2 className="font-display text-2xl font-bold mb-8 flex items-center gap-3"><Briefcase className="w-6 h-6 text-primary" />Experience</h2>
            <div className="space-y-8">
              {experiences.map((exp, i) => (
                <div key={i} className="p-6 rounded-xl bg-card border border-border">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                    <h3 className="font-display font-semibold text-lg">{exp.role}</h3>
                    <span className="text-sm text-muted-foreground">{exp.period}</span>
                  </div>
                  <p className="text-primary font-medium mb-3">{exp.company}</p>
                  <ul className="space-y-1">{exp.highlights.map((h, j) => <li key={j} className="text-sm text-muted-foreground flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" />{h}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-20">
            <h2 className="font-display text-2xl font-bold mb-8">My Toolkit</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-primary" />Tools
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tools.map((tool) => <span key={tool} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm">{tool}</span>)}
                </div>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-primary" />Methodologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {methodologies.map((method) => <span key={method} className="px-3 py-1.5 rounded-lg bg-secondary text-foreground text-sm">{method}</span>)}
                </div>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => <span key={skill} className="px-3 py-1.5 rounded-lg bg-accent/10 text-accent-foreground text-sm">{skill}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
