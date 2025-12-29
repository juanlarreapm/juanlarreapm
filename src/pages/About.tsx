import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Briefcase, GraduationCap, Award } from "lucide-react";

const experiences = [
  { company: "PartsTech", role: "Senior Product Manager", period: "2022 - Present", highlights: ["Led EstimateXpress 0-to-1 launch", "500+ shops onboarded", "10% cart size increase with Jobs feature"] },
  { company: "Nordstrom", role: "Product Manager", period: "2021 - 2022", highlights: ["Enterprise e-commerce initiatives", "Cross-functional leadership"] },
  { company: "Intellum", role: "Product Manager", period: "2019 - 2021", highlights: ["Learning platform features", "B2B SaaS experience"] },
  { company: "INWEGO", role: "Product Manager", period: "2017 - 2019", highlights: ["51% conversion increase", "Funnel optimization"] },
  { company: "Merchants Preferred", role: "Associate PM", period: "2015 - 2017", highlights: ["Payment solutions", "Early PM experience"] },
];

const skills = ["Product Strategy", "0-to-1 Launches", "Growth & Optimization", "A/B Testing", "User Research", "Roadmap Planning", "Cross-functional Leadership", "Data Analysis", "Agile/Scrum", "SQL", "AI/ML Exploration"];

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
            <h2 className="font-display text-2xl font-bold mb-8 flex items-center gap-3"><Award className="w-6 h-6 text-primary" />Skills</h2>
            <div className="flex flex-wrap gap-3">{skills.map((skill) => <span key={skill} className="px-4 py-2 rounded-lg bg-secondary text-foreground text-sm">{skill}</span>)}</div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
