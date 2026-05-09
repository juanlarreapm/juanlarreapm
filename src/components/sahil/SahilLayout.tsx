import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Mail, Linkedin, Github } from "lucide-react";
import { usePageTracking } from "@/hooks/usePageTracking";
import { useToolkitVisible } from "@/hooks/useToolkitVisible";
import { useBlogVisible } from "@/hooks/useBlogVisible";
import "@/styles/sahil-theme.css";

interface SahilLayoutProps {
  children: ReactNode;
  /** When true, narrows main column for editorial reading. Default true. */
  narrow?: boolean;
}

export function SahilLayout({ children, narrow = true }: SahilLayoutProps) {
  usePageTracking();
  const isToolkitVisible = useToolkitVisible();
  const isBlogVisible = useBlogVisible();
  const widthClass = narrow ? "max-w-[720px]" : "max-w-[960px]";

  return (
    <div className="sahil-theme">
      <main className={`${widthClass} mx-auto px-6 pt-16 pb-24 sh-fade`}>
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-16">
          <Link to="/" className="flex items-center gap-3 no-underline" style={{ color: "inherit" }}>
            <span className="sh-avatar-fallback">JL</span>
            <span className="sh-name">Juan Larrea</span>
          </Link>
          <nav className="flex items-center gap-x-5 gap-y-2 flex-wrap">
            <ul
              className="sh-body flex flex-wrap gap-x-5 gap-y-2"
              style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 16 }}
            >
              <li><Link to="/about" className="sh-link">about</Link></li>
              <li><Link to="/case-studies" className="sh-link">work</Link></li>
              {isBlogVisible && <li><Link to="/blog" className="sh-link">writing</Link></li>}
              <li><Link to="/lab" className="sh-link">lab</Link></li>
              {isToolkitVisible && <li><Link to="/toolkit" className="sh-link">toolkit</Link></li>}
            </ul>
            <span className="sh-icon-divider" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <a href="mailto:juanlarreapm@gmail.com" aria-label="Email" className="sh-icon-link">
                <Mail size={18} />
              </a>
              <a href="https://www.linkedin.com/in/juanlarreapm/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="sh-icon-link">
                <Linkedin size={18} />
              </a>
              <a href="https://github.com/juanlarreapm" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="sh-icon-link">
                <Github size={18} />
              </a>
            </div>
          </nav>
        </header>

        {children}

        <hr className="sh-rule mb-6 mt-20" />
        <footer className="sh-chip">
          © {new Date().getFullYear()} · written, designed, and shipped from a small desk.
        </footer>
      </main>
    </div>
  );
}
