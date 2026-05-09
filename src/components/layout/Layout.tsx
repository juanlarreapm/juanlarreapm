import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { usePageTracking } from "@/hooks/usePageTracking";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  usePageTracking();
  return (
    <div className="min-h-screen flex flex-col noise-overlay">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
    </div>
  );
}
