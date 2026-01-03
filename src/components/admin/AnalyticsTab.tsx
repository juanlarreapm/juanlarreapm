import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Eye, FileText, Clock, Sparkles, Monitor, Smartphone, Globe } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts";
import { format, subDays } from "date-fns";

interface AnalyticsData {
  total_visitors: number;
  total_pageviews: number;
  avg_pages_per_visit: number;
  avg_session_duration_seconds: number;
  bounce_rate: number;
  page_breakdown: { page: string; views: number }[];
  traffic_sources: { source: string; count: number }[];
  devices: { device: string; count: number }[];
  countries: { country: string; count: number }[];
  daily_pageviews?: { date: string; views: number }[];
}

export function AnalyticsTab() {
  // Fetch Lovable analytics
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async (): Promise<AnalyticsData | null> => {
      // This would normally fetch from an analytics endpoint
      // For now, we'll return mock data that matches the structure
      // In production, this would be replaced with actual API calls
      return null;
    },
  });

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

  // Mock data for demonstration (in production, this would come from the analytics API)
  const mockDailyViews = Array.from({ length: 14 }, (_, i) => ({
    date: format(subDays(new Date(), 13 - i), "MMM d"),
    views: Math.floor(Math.random() * 50) + 10,
  }));

  const mockTopPages = [
    { page: "/", views: 120 },
    { page: "/about", views: 45 },
    { page: "/projects", views: 38 },
    { page: "/contact", views: 28 },
    { page: "/toolkit", views: 22 },
  ];

  const mockSources = [
    { source: "Direct", count: 85 },
    { source: "Google", count: 42 },
    { source: "LinkedIn", count: 18 },
    { source: "Twitter", count: 12 },
  ];

  const chartConfig = {
    views: {
      label: "Views",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Analytics coming soon</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pageviews</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Analytics coming soon</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Published Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(contentStats?.posts || 0) + (contentStats?.projects || 0) + (contentStats?.labProjects || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {contentStats?.posts || 0} posts, {contentStats?.projects || 0} projects, {contentStats?.labProjects || 0} lab
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Contact Messages</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contactCount || 0}</div>
            <p className="text-xs text-muted-foreground">Total submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pageviews Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Pageviews (Last 14 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <LineChart data={mockDailyViews}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Sample data - integrate with analytics API for real metrics
            </p>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTopPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-5">{index + 1}.</span>
                    <span className="text-sm font-medium truncate max-w-[200px]">{page.page}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{page.views} views</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Sample data - integrate with analytics API for real metrics
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              {mockSources.map((source) => (
                <div key={source.source} className="flex items-center justify-between">
                  <span className="text-sm">{source.source}</span>
                  <span className="text-sm text-muted-foreground">{source.count}</span>
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
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <Monitor className="h-3 w-3" /> Desktop
                </span>
                <span className="text-sm text-muted-foreground">68%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <Smartphone className="h-3 w-3" /> Mobile
                </span>
                <span className="text-sm text-muted-foreground">32%</span>
              </div>
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
    </div>
  );
}
