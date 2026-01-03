import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Get or create a session ID for anonymous tracking (per browser session)
function getSessionId(): string {
  const key = "analytics_session_id";
  let sessionId = sessionStorage.getItem(key);
  
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(key, sessionId);
  }
  
  return sessionId;
}

// Get or create a visitor ID for persistent tracking (survives browser restarts)
function getVisitorId(): string {
  const key = "analytics_visitor_id";
  let visitorId = localStorage.getItem(key);
  
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem(key, visitorId);
  }
  
  return visitorId;
}

export function usePageTracking() {
  const location = useLocation();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Avoid tracking the same page twice in a row (e.g., on re-renders)
    if (lastTrackedPath.current === currentPath) {
      return;
    }
    
    lastTrackedPath.current = currentPath;

    const trackPageView = async () => {
      try {
        const sessionId = getSessionId();
        const visitorId = getVisitorId();
        
        await supabase.from("analytics_events").insert({
          event_type: "page_view",
          page_path: currentPath,
          session_id: sessionId,
          visitor_id: visitorId,
          metadata: {
            referrer: document.referrer || null,
            userAgent: navigator.userAgent,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            timestamp: new Date().toISOString(),
          },
        });
      } catch (error) {
        // Silently fail - don't break the app for analytics
        console.debug("Page tracking error:", error);
      }
    };

    trackPageView();
  }, [location.pathname]);
}
