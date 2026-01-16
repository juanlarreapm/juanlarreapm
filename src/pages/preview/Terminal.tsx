import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "@/styles/terminal-theme.css";

const Terminal = () => {
  const [bootComplete, setBootComplete] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Simulate boot sequence
    const bootTimer = setTimeout(() => setBootComplete(true), 1500);
    const contentTimer = setTimeout(() => setShowContent(true), 2000);
    return () => {
      clearTimeout(bootTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-terminal-green font-mono terminal-scanlines matrix-bg terminal-select">
      {/* Back to home link */}
      <div className="fixed top-4 left-4 z-50">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-terminal-green hover:text-terminal-amber transition-colors text-sm terminal-glow-subtle"
        >
          <ArrowLeft size={16} />
          <span>&lt;-- BACK_TO_CURRENT_SITE</span>
        </Link>
      </div>

      {/* Theme indicator */}
      <div className="fixed top-4 right-4 z-50 text-xs text-terminal-amber terminal-glow-subtle">
        TERMINAL_PREVIEW.exe
      </div>

      {/* Boot Sequence */}
      {!bootComplete && (
        <div className="fixed inset-0 bg-black z-40 flex items-center justify-center">
          <div className="space-y-2 text-sm">
            <p className="terminal-glow" style={{ animationDelay: '0s' }}>
              [BOOT] Initializing system...
            </p>
            <p className="terminal-glow" style={{ animationDelay: '0.3s' }}>
              [OK] Loading portfolio_v2.0...
            </p>
            <p className="terminal-glow" style={{ animationDelay: '0.6s' }}>
              [OK] Connecting to experience_db...
            </p>
            <p className="terminal-glow" style={{ animationDelay: '0.9s' }}>
              [OK] Mounting achievements...
            </p>
            <p className="terminal-glow animate-pulse" style={{ animationDelay: '1.2s' }}>
              [READY] Welcome, visitor.
            </p>
          </div>
        </div>
      )}

      {/* Main Terminal Content */}
      <main className={`transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <section className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="w-full max-w-3xl">
            {/* Terminal Window */}
            <div className="terminal-window rounded-none">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-terminal-green/30 bg-terminal-green/5">
                <div className="w-3 h-3 rounded-full bg-terminal-red" />
                <div className="w-3 h-3 rounded-full bg-terminal-amber" />
                <div className="w-3 h-3 rounded-full bg-terminal-green" />
                <span className="ml-4 text-xs text-terminal-dim">juan@portfolio:~</span>
              </div>

              {/* Terminal Body */}
              <div className="p-6 space-y-4 text-sm md:text-base">
                {/* whoami command */}
                <div>
                  <p className="text-terminal-dim">visitor@portfolio:~$ <span className="text-terminal-green">whoami</span></p>
                  <p className="terminal-glow text-2xl md:text-3xl font-bold mt-2">juan_larrea</p>
                </div>

                {/* Role */}
                <div>
                  <p className="text-terminal-dim">visitor@portfolio:~$ <span className="text-terminal-green">cat role.txt</span></p>
                  <p className="text-terminal-amber terminal-glow-subtle mt-2">Senior Product Manager</p>
                  <p className="text-terminal-dim mt-1">// Specializing in 0-to-1 launches & growth optimization</p>
                </div>

                {/* Current Status */}
                <div>
                  <p className="text-terminal-dim">visitor@portfolio:~$ <span className="text-terminal-green">./check_status.sh</span></p>
                  <div className="mt-2 pl-4 border-l-2 border-terminal-green/50">
                    <p><span className="text-terminal-amber">CURRENT_ROLE:</span> Product Manager @ PartsTech</p>
                    <p><span className="text-terminal-amber">STATUS:</span> <span className="text-terminal-green animate-pulse">● OPEN_TO_OPPORTUNITIES</span></p>
                    <p><span className="text-terminal-amber">LOCATION:</span> Atlanta, GA</p>
                  </div>
                </div>

                {/* Stats */}
                <div>
                  <p className="text-terminal-dim">visitor@portfolio:~$ <span className="text-terminal-green">./stats --summary</span></p>
                  <div className="mt-2 grid grid-cols-3 gap-4 text-center">
                    <div className="border border-terminal-green/30 p-3">
                      <p className="text-2xl terminal-glow">8+</p>
                      <p className="text-xs text-terminal-dim">YEARS_EXP</p>
                    </div>
                    <div className="border border-terminal-green/30 p-3">
                      <p className="text-2xl terminal-glow">5+</p>
                      <p className="text-xs text-terminal-dim">INDUSTRIES</p>
                    </div>
                    <div className="border border-terminal-green/30 p-3">
                      <p className="text-2xl terminal-glow">B2B</p>
                      <p className="text-xs text-terminal-dim">FOCUS</p>
                    </div>
                  </div>
                </div>

                {/* Skills Loading Bar */}
                <div>
                  <p className="text-terminal-dim">visitor@portfolio:~$ <span className="text-terminal-green">./load_skills.sh</span></p>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="w-24 text-xs">product_mgmt</span>
                      <div className="flex-1 h-3 bg-terminal-green/20 border border-terminal-green/30">
                        <div className="h-full bg-terminal-green" style={{ width: '95%' }} />
                      </div>
                      <span className="text-xs text-terminal-amber">95%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-24 text-xs">ux_research</span>
                      <div className="flex-1 h-3 bg-terminal-green/20 border border-terminal-green/30">
                        <div className="h-full bg-terminal-green" style={{ width: '90%' }} />
                      </div>
                      <span className="text-xs text-terminal-amber">90%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-24 text-xs">data_analysis</span>
                      <div className="flex-1 h-3 bg-terminal-green/20 border border-terminal-green/30">
                        <div className="h-full bg-terminal-green" style={{ width: '85%' }} />
                      </div>
                      <span className="text-xs text-terminal-amber">85%</span>
                    </div>
                  </div>
                </div>

                {/* Navigation Commands */}
                <div className="pt-4 border-t border-terminal-green/30">
                  <p className="text-terminal-dim mb-3">visitor@portfolio:~$ <span className="text-terminal-green">ls -la ./navigation/</span></p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link 
                      to="/about" 
                      className="block p-3 border border-terminal-green/50 hover:bg-terminal-green/10 hover:border-terminal-green transition-all group"
                    >
                      <span className="text-terminal-green group-hover:terminal-glow">./view_experience.sh</span>
                      <p className="text-xs text-terminal-dim mt-1">// Work history & skills</p>
                    </Link>
                    <Link 
                      to="/case-studies" 
                      className="block p-3 border border-terminal-green/50 hover:bg-terminal-green/10 hover:border-terminal-green transition-all group"
                    >
                      <span className="text-terminal-green group-hover:terminal-glow">./case_studies/</span>
                      <p className="text-xs text-terminal-dim mt-1">// Project deep dives</p>
                    </Link>
                    <Link 
                      to="/lab" 
                      className="block p-3 border border-terminal-green/50 hover:bg-terminal-green/10 hover:border-terminal-green transition-all group"
                    >
                      <span className="text-terminal-green group-hover:terminal-glow">./lab_projects/</span>
                      <p className="text-xs text-terminal-dim mt-1">// Side experiments</p>
                    </Link>
                    <Link 
                      to="/contact" 
                      className="block p-3 border border-terminal-green/50 hover:bg-terminal-green/10 hover:border-terminal-green transition-all group"
                    >
                      <span className="text-terminal-green group-hover:terminal-glow">./send_message.sh</span>
                      <p className="text-xs text-terminal-dim mt-1">// Get in touch</p>
                    </Link>
                  </div>
                </div>

                {/* Cursor */}
                <div className="pt-4">
                  <p className="text-terminal-dim">
                    visitor@portfolio:~$ <span className="cursor-blink" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sample Case Study Card */}
        <section className="px-4 py-20 max-w-3xl mx-auto">
          <div className="mb-8">
            <p className="text-terminal-dim">visitor@portfolio:~$ <span className="text-terminal-green">cat ./case_studies/featured.md</span></p>
          </div>
          
          <div className="terminal-window p-6 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-terminal-amber">[FEATURED]</span>
              <span className="text-terminal-dim">last_modified: 2024-12-15</span>
            </div>
            <h3 className="text-xl terminal-glow">
              # Enterprise Onboarding Redesign
            </h3>
            <p className="text-terminal-dim leading-relaxed">
              Redesigned the onboarding flow for enterprise customers at PartsTech, 
              resulting in 40% faster activation times and improved customer satisfaction scores.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs border border-terminal-green/50 px-2 py-1 text-terminal-green">
                #ux_research
              </span>
              <span className="text-xs border border-terminal-green/50 px-2 py-1 text-terminal-green">
                #b2b_saas
              </span>
              <span className="text-xs border border-terminal-green/50 px-2 py-1 text-terminal-green">
                #growth
              </span>
            </div>
            <div className="pt-4">
              <span className="text-terminal-amber hover:underline cursor-pointer">
                → ./read_full_case_study.sh
              </span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-terminal-green/30 py-8 text-center">
          <p className="text-sm text-terminal-dim">
            <span className="text-terminal-green">$</span> echo "© 2025 Juan Larrea • Built with passion"
          </p>
          <p className="text-terminal-green terminal-glow-subtle mt-2">
            © 2025 Juan Larrea • Built with passion
          </p>
          <p className="text-xs text-terminal-dim mt-4">
            [SESSION_ID: {Math.random().toString(36).substring(7)}] [UPTIME: ∞]
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Terminal;
