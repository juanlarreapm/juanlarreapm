import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Eye, FileText, Clock, Sparkles, Monitor, Smartphone, Globe, TrendingUp, ArrowUpRight } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, BarChart, Bar, Cell } from "recharts";
import { format, subDays, parseISO } from "date-fns";

// Real analytics data from Lovable Analytics (last updated: 2026-01-03)
const ANALYTICS_DATA = {
  total_visitors: 89,
  total_pageviews: 413,
  avg_pages_per_visit: 4.64,
  avg_session_duration_seconds: 307,
  bounce_rate: 72,
  daily_visitors: [
    { date: "2025-12-29", value: 5 },
    { date: "2025-12-30", value: 9 },
    { date: "2025-12-31", value: 6 },
    { date: "2026-01-01", value: 34 },
    { date: "2026-01-02", value: 27 },
    { date: "2026-01-03", value: 8 },
  ],
  daily_pageviews: [
    { date: "2025-12-29", views: 10 },
    { date: "2025-12-30", views: 38 },
    { date: "2025-12-31", views: 10 },
    { date: "2026-01-01", views: 189 },
    { date: "2026-01-02", views: 140 },
    { date: "2026-01-03", views: 26 },
  ],
  top_pages: [
    { page: "/", views: 80 },
    { page: "/about", views: 10 },
    { page: "/admin", views: 10 },
    { page: "/projects", views: 8 },
    { page: "/contact", views: 7 },
    { page: "/blog", views: 7 },
    { page: "/case-studies", views: 5 },
    { page: "/toolkit", views: 5 },
    { page: "/auth", views: 4 },
    { page: "/lab", views: 3 },
  ],
  traffic_sources: [
    { source: "Direct", count: 85 },
    { source: "bing.com", count: 1 },
    { source: "google.com", count: 1 },
  ],
  devices: [
    { device: "Desktop", count: 68 },
    { device: "Mobile", count: 19 },
  ],
  countries: [
    { country: "US", count: 52 },
    { country: "Unknown", count: 28 },
    { country: "CY", count: 4 },
    { country: "ES", count: 2 },
    { country: "IT", count: 1 },
  ],
};

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function AnalyticsTab() {
  // Fetch Easter egg discoveries count
  const { data: easterEggCount } = useQuery({
    queryKey: ["easter-egg-discoveries"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("analytics_events")
        .select("*", { count: "exact", head: true })
        .eq("event_type", "easter_egg_discovery");
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch recent Easter egg discoveries for last 7 days
  const { data: recentEasterEggs } = useQuery({
    queryKey: ["easter-egg-discoveries-recent"],
    queryFn: async () => {
      const sevenDaysAgo = subDays(new Date(), 7).toISOString();
      const { count, error } = await supabase
        .from("analytics_events")
        .select("*", { count: "exact", head: true })
        .eq("event_type", "easter_egg_discovery")
        .gte("created_at", sevenDaysAgo);
      if (error) throw error;
      return count || 0;
    },
  });

  // Content stats
  const { data: contentStats } = useQuery({
    queryKey: ["content-stats"],
    queryFn: async () => {
      const [posts, projects, labProjects] = await Promise.all([
        supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("published", true),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("published", true),
        supabase.from("lab_projects").select("id", { count: "exact", head: true }).eq("published", true),
      ]);
      return {
        posts: posts.count || 0,
        projects: projects.count || 0,
        labProjects: labProjects.count || 0,
      };
    },
  });

  // Contact submissions count
  const { data: contactCount } = useQuery({
    queryKey: ["contact-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("contact_submissions")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const chartConfig = {
    views: {
      label: "Views",
      color: "hsl(var(--primary))",
    },
    visitors: {
      label: "Visitors",
      color: "hsl(var(--accent))",
    },
  };

  // Format dates for chart display
  const chartData = ANALYTICS_DATA.daily_pageviews.map((item, index) => ({
    date: format(parseISO(item.date), "MMM d"),
    views: item.views,
    visitors: ANALYTICS_DATA.daily_visitors[index]?.value || 0,
  }));

  const deviceTotal = ANALYTICS_DATA.devices.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ANALYTICS_DATA.total_visitors}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              Since Dec 29, 2025
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pageviews</CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ANALYTICS_DATA.total_pageviews}</div>
            <p className="text-xs text-muted-foreground">
              {ANALYTICS_DATA.avg_pages_per_visit.toFixed(2)} pages/visit avg
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Session</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(ANALYTICS_DATA.avg_session_duration_seconds)}</div>
            <p className="text-xs text-muted-foreground">
              {ANALYTICS_DATA.bounce_rate}% bounce rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Published Content</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(contentStats?.posts || 0) + (contentStats?.projects || 0) + (contentStats?.labProjects || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {contentStats?.posts || 0} posts, {contentStats?.projects || 0} case studies, {contentStats?.labProjects || 0} lab
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pageviews Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Traffic Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <LineChart data={chartData}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 3 }}
                  name="Pageviews"
                />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--accent))", strokeWidth: 0, r: 3 }}
                  name="Visitors"
                />
              </LineChart>
            </ChartContainer>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Pageviews</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span className="text-sm text-muted-foreground">Visitors</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ANALYTICS_DATA.top_pages.slice(0, 6).map((page, index) => (
                <div key={page.page} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-5">{index + 1}.</span>
                    <span className="text-sm font-medium truncate max-w-[200px]">{page.page}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${(page.views / ANALYTICS_DATA.top_pages[0].views) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">{page.views}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Traffic Sources */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ANALYTICS_DATA.traffic_sources.map((source) => (
                <div key={source.source} className="flex items-center justify-between">
                  <span className="text-sm">{source.source}</span>
                  <span className="text-sm font-medium">{source.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Monitor className="h-4 w-4 text-primary" />
              Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ANALYTICS_DATA.devices.map((device) => (
                <div key={device.device} className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    {device.device === "Desktop" ? <Monitor className="h-3 w-3" /> : <Smartphone className="h-3 w-3" />}
                    {device.device}
                  </span>
                  <span className="text-sm font-medium">{Math.round((device.count / deviceTotal) * 100)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-primary" />
              Top Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ANALYTICS_DATA.countries.slice(0, 4).map((country) => (
                <div key={country.country} className="flex items-center justify-between">
                  <span className="text-sm">{country.country}</span>
                  <span className="text-sm font-medium">{country.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Easter Egg Counter */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Easter Egg Discoveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{easterEggCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              {recentEasterEggs || 0} in the last 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contact Messages Card */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold">Contact Form Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold">{contactCount || 0}</div>
            <div className="text-sm text-muted-foreground">
              Total contact form submissions received
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        Analytics data last synced on Jan 3, 2026. Contact Lovable support for real-time analytics integration.
      </p>
    </div>
  );
}
