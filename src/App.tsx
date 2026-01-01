import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PageTransition } from "./components/PageTransition";
import { EasterEgg } from "./components/EasterEgg";
import { useKonamiCode } from "./hooks/useKonamiCode";
import Index from "./pages/Index";
import About from "./pages/About";
import Toolkit from "./pages/Toolkit";
import CaseStudies from "./pages/CaseStudies";
import CaseStudy from "./pages/CaseStudy";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import PostEditor from "./pages/PostEditor";
import ExperienceEditor from "./pages/ExperienceEditor";
import CaseStudyEditor from "./pages/CaseStudyEditor";
import ToolkitItemEditor from "./pages/ToolkitItemEditor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { isActivated, reset } = useKonamiCode();

  return (
    <>
      <EasterEgg isActive={isActivated} onClose={reset} />
      <PageTransition>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/toolkit" element={<Toolkit />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/case-studies/:slug" element={<CaseStudy />} />
          {/* Redirect old /projects route to /case-studies */}
          <Route path="/projects" element={<Navigate to="/case-studies" replace />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/posts/:id" element={<PostEditor />} />
          <Route path="/admin/experiences/:id" element={<ExperienceEditor />} />
          <Route path="/admin/case-studies/:id" element={<CaseStudyEditor />} />
          <Route path="/admin/toolkit/:type/:id" element={<ToolkitItemEditor />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
