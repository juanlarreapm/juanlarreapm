import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const { pathname } = useLocation();
  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(path + "/");
  const linkCls = (path: string) => `sh-link${isActive(path) ? " is-active" : ""}`;

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
              <li><Link to="/" className={linkCls("/")}>home</Link></li>
              <li><Link to="/about" className={linkCls("/about")}>about</Link></li>
              <li><Link to="/case-studies" className={linkCls("/case-studies")}>work</Link></li>
              {isBlogVisible && <li><Link to="/blog" className={linkCls("/blog")}>writing</Link></li>}
              <li><Link to="/lab" className={linkCls("/lab")}>lab</Link></li>
              {isToolkitVisible && <li><Link to="/toolkit" className={linkCls("/toolkit")}>toolkit</Link></li>}
            </ul>
            <span className="sh-icon-divider" aria-hidden="true" />
            <div className="flex items-center gap-5 sm:gap-4">
              <a href="mailto:juanlarreapm@gmail.com" aria-label="Email" className="sh-icon-link p-1 -m-1">
                <Mail size={18} />
              </a>
              <a href="https://www.linkedin.com/in/juanlarreapm/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="sh-icon-link p-1 -m-1">
                <Linkedin size={18} />
              </a>
              <a href="https://github.com/juanlarreapm" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="sh-icon-link p-1 -m-1">
                <Github size={18} />
              </a>
            </div>
          </nav>
        </header>

        {children}
      </main>
    </div>
  );
}
