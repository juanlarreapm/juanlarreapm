import { ReactNode, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: "instant" });
    
    // Trigger animation by removing and re-adding class
    const container = containerRef.current;
    if (container) {
      container.style.animation = "none";
      container.offsetHeight; // Force reflow
      container.style.animation = "";
    }
  }, [location.pathname]);

  return (
    <div
      ref={containerRef}
      className="animate-fade-in"
    >
      {children}
    </div>
  );
}