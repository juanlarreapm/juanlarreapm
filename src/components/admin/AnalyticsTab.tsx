import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Eye, FileText, Clock, Sparkles, Monitor, Smartphone, Globe, TrendingUp, ArrowUpRight, RefreshCw } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis } from "recharts";
import { format, subDays, parseISO } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";

interface TopPage {
  path: string;
  views: number;
}

interface TrafficSource {
  source: string;
  percentage: number;
}

interface Device {
  device: string;
  percentage: number;
}

interface Country {
  country: string;
  percentage: number;
}

interface AnalyticsSnapshot {
  id: string;
  snapshot_date: string;
  total_visitors: number;
  total_pageviews: number;
  avg_pages_per_visit: number;
  avg_session_duration_seconds: number;
  bounce_rate: number;
  top_pages: TopPage[];
  traffic_sources: TrafficSource[];
  devices: Device[];
  countries: Country[];
  created_at: string;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function AnalyticsTab() {
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch the latest analytics snapshot
  const { data: snapshot, refetch: refetchSnapshot } = useQuery({
    queryKey: ["analytics-snapshot"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_snapshots")
        .select("*")
        .order("snapshot_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      
      // Type assertion for JSONB fields
      if (data) {
        return {
          ...data,
          top_pages: (data.top_pages || []) as unknown as TopPage[],
          traffic_sources: (data.traffic_sources || []) as unknown as TrafficSource[],
          devices: (data.devices || []) as unknown as Device[],
          countries: (data.countries || []) as unknown as Country[],
        } as AnalyticsSnapshot;
      }
      return null;
    },
  });

  // Fetch historical snapshots for chart
  const { data: historicalData } = useQuery({
    queryKey: ["analytics-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_snapshots")
        .select("snapshot_date, total_visitors, total_pageviews")
        .order("snapshot_date", { ascending: true })
        .limit(7);
      
      if (error) throw error;
      return data || [];
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

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("sync-analytics");
      
      if (error) throw error;
      
      toast.success("Analytics synced successfully!");
      refetchSnapshot();
    } catch (error: any) {
      console.error("Sync error:", error);
      toast.error("Failed to sync analytics");
    } finally {
      setIsSyncing(false);
    }
  };

  const chartConfig = {
    views: {
      label: "Pageviews",
      color: "hsl(var(--primary))",
    },
    visitors: {
      label: "Visitors",
      color: "hsl(var(--accent))",
    },
  };

  // Format dates for chart display
  const chartData = historicalData?.map((item) => ({
    date: format(parseISO(item.snapshot_date), "MMM d"),
    views: item.total_pageviews,
    visitors: item.total_visitors,
  })) || [];

  // Default values if no snapshot exists
  const totalVisitors = snapshot?.total_visitors || 0;
  const totalPageviews = snapshot?.total_pageviews || 0;
  const avgPagesPerVisit = snapshot?.avg_pages_per_visit || 0;
  const avgSessionDuration = snapshot?.avg_session_duration_seconds || 0;
  const bounceRate = snapshot?.bounce_rate || 0;
  const topPages = snapshot?.top_pages || [];
  const trafficSources = snapshot?.traffic_sources || [];
  const devices = snapshot?.devices || [];
  const countries = snapshot?.countries || [];

  const lastSyncDate = snapshot?.created_at 
    ? format(parseISO(snapshot.created_at), "MMM d, yyyy 'at' h:mm a")
    : "Never";

  return (
    <div className="space-y-6">
      {/* Sync Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Auto-synced daily at midnight UTC
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleManualSync}
          disabled={isSyncing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "Syncing..." : "Sync Now"}
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisitors}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              Last 7 days
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pageviews</CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPageviews}</div>
            <p className="text-xs text-muted-foreground">
              {avgPagesPerVisit.toFixed(2)} pages/visit avg
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Session</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(avgSessionDuration)}</div>
            <p className="text-xs text-muted-foreground">
              {bounceRate}% bounce rate
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
            {chartData.length > 0 ? (
              <>
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
              </>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                No data yet. Click "Sync Now" to fetch analytics.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            {topPages.length > 0 ? (
              <div className="space-y-3">
                {topPages.slice(0, 6).map((page, index) => (
                  <div key={page.path} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-5">{index + 1}.</span>
                      <span className="text-sm font-medium truncate max-w-[200px]">{page.path}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${(page.views / (topPages[0]?.views || 1)) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">{page.views}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                No page data yet.
              </div>
            )}
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
              {trafficSources.length > 0 ? (
                trafficSources.map((source) => (
                  <div key={source.source} className="flex items-center justify-between">
                    <span className="text-sm">{source.source}</span>
                    <span className="text-sm font-medium">{source.percentage}%</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No data</p>
              )}
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
              {devices.length > 0 ? (
                devices.map((device) => (
                  <div key={device.device} className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2">
                      {device.device === "Desktop" ? <Monitor className="h-3 w-3" /> : <Smartphone className="h-3 w-3" />}
                      {device.device}
                    </span>
                    <span className="text-sm font-medium">{device.percentage}%</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No data</p>
              )}
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
              {countries.length > 0 ? (
                countries.slice(0, 4).map((country) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <span className="text-sm">{country.country}</span>
                    <span className="text-sm font-medium">{country.percentage}%</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No data</p>
              )}
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
        Last synced: {lastSyncDate}
      </p>
    </div>
  );
}
