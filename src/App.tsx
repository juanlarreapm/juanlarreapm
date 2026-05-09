import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { PageTransition } from "./components/PageTransition";
import { EasterEgg } from "./components/EasterEgg";
import { useKonamiCode } from "./hooks/useKonamiCode";
import { useActiveTheme } from "./hooks/useActiveTheme";

// b2b pages
import Index from "./pages/Index";
import About from "./pages/About";
import Toolkit from "./pages/Toolkit";
import CaseStudies from "./pages/CaseStudies";
import CaseStudy from "./pages/CaseStudy";
import Lab from "./pages/Lab";
import LabProject from "./pages/LabProject";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// sahil pages
import SahilIndex from "./pages/sahil/Index";
import SahilAbout from "./pages/sahil/About";
import SahilToolkit from "./pages/sahil/Toolkit";
import SahilCaseStudies from "./pages/sahil/CaseStudies";
import SahilCaseStudy from "./pages/sahil/CaseStudy";
import SahilLab from "./pages/sahil/Lab";
import SahilLabProject from "./pages/sahil/LabProject";
import SahilBlog from "./pages/sahil/Blog";
import SahilBlogPost from "./pages/sahil/BlogPost";
import SahilContact from "./pages/sahil/Contact";
import SahilNotFound from "./pages/sahil/NotFound";

// shared (theme-agnostic)
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Admin from "./pages/Admin";
import PostEditor from "./pages/PostEditor";
import ExperienceEditor from "./pages/ExperienceEditor";
import CompanyEditor from "./pages/CompanyEditor";
import CaseStudyEditor from "./pages/CaseStudyEditor";
import LabEditor from "./pages/LabEditor";
import ToolkitItemEditor from "./pages/ToolkitItemEditor";

import Retro8Bit from "./pages/preview/Retro8Bit";
import Terminal from "./pages/preview/Terminal";
import Editorial from "./pages/preview/Editorial";
import Swiss from "./pages/preview/Swiss";
import Quiet from "./pages/preview/Quiet";
import Sahil from "./pages/preview/Sahil";

import "@/styles/sahil-theme.css";

const queryClient = new QueryClient();

function AppContent() {
  const { isActivated, reset } = useKonamiCode();
  const theme = useActiveTheme();
  const sahil = theme === "sahil";

  // Apply .sahil-theme to <html> so admin/auth/editors inherit Sahil tokens too.
  useEffect(() => {
    const root = document.documentElement;
    if (sahil) root.classList.add("sahil-theme");
    else root.classList.remove("sahil-theme");

    // Swap favicon to match active theme
    const sahilFavicon = "/favicon-sahil.png";
    const defaultFavicon =
      "https://storage.googleapis.com/gpt-engineer-file-uploads/BJ6HlcqMRgRoIR6ZsXVvxOFDj8d2/uploads/1767050665216-Xnip2025-12-29_18-24-17.jpg";
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.type = sahil ? "image/png" : "image/x-icon";
    link.href = sahil ? sahilFavicon : defaultFavicon;

    return () => root.classList.remove("sahil-theme");
  }, [sahil]);

  return (
    <>
      <EasterEgg isActive={isActivated} onClose={reset} />
      <PageTransition>
        <Routes>
          <Route path="/" element={sahil ? <SahilIndex /> : <Index />} />
          <Route path="/about" element={sahil ? <SahilAbout /> : <About />} />
          <Route path="/toolkit" element={sahil ? <SahilToolkit /> : <Toolkit />} />
          <Route path="/case-studies" element={sahil ? <SahilCaseStudies /> : <CaseStudies />} />
          <Route path="/case-studies/:slug" element={sahil ? <SahilCaseStudy /> : <CaseStudy />} />
          <Route path="/projects" element={<Navigate to="/case-studies" replace />} />
          <Route path="/lab" element={sahil ? <SahilLab /> : <Lab />} />
          <Route path="/lab/:slug" element={sahil ? <SahilLabProject /> : <LabProject />} />
          <Route path="/blog" element={sahil ? <SahilBlog /> : <Blog />} />
          <Route path="/blog/:slug" element={sahil ? <SahilBlogPost /> : <BlogPost />} />
          <Route path="/contact" element={sahil ? <SahilContact /> : <Contact />} />

          {/* Admin / auth / editors — keep their structure; .sahil-theme on <html> restyles tokens */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/posts/:id" element={<PostEditor />} />
          <Route path="/admin/experiences/:id" element={<ExperienceEditor />} />
          <Route path="/admin/case-studies/:id" element={<CaseStudyEditor />} />
          <Route path="/admin/lab/:id" element={<LabEditor />} />
          <Route path="/admin/toolkit/:type/:id" element={<ToolkitItemEditor />} />

          {/* Theme Preview Routes */}
          <Route path="/preview/8bit" element={<Retro8Bit />} />
          <Route path="/preview/terminal" element={<Terminal />} />
          <Route path="/preview/editorial" element={<Editorial />} />
          <Route path="/preview/swiss" element={<Swiss />} />
          <Route path="/preview/quiet" element={<Quiet />} />
          <Route path="/preview/sahil" element={<Sahil />} />

          <Route path="*" element={sahil ? <SahilNotFound /> : <NotFound />} />
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
