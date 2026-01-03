import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Users, Eye, Clock, Sparkles, Monitor, Smartphone, Globe, TrendingUp, ArrowUpRight, RefreshCw, CalendarIcon, UserPlus } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis } from "recharts";
import { format, subDays, parseISO, startOfDay, endOfDay } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

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

type DatePreset = "7d" | "30d" | "90d" | "custom";

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function AnalyticsTab() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [datePreset, setDatePreset] = useState<DatePreset>("7d");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Calculate date range based on preset or custom selection
  const getDateRange = () => {
    const now = new Date();
    if (datePreset === "custom" && customRange?.from) {
      return {
        from: startOfDay(customRange.from),
        to: customRange.to ? endOfDay(customRange.to) : endOfDay(customRange.from),
      };
    }
    
    const days = datePreset === "7d" ? 7 : datePreset === "30d" ? 30 : 90;
    return {
      from: startOfDay(subDays(now, days)),
      to: endOfDay(now),
    };
  };

  const dateRange = getDateRange();

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

  // Fetch page view events for the selected date range
  const { data: pageViewStats } = useQuery({
    queryKey: ["page-view-stats", dateRange.from.toISOString(), dateRange.to.toISOString()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("*")
        .eq("event_type", "page_view")
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString());
      
      if (error) throw error;
      
      // Aggregate stats
      const sessions = new Set<string>();
      const pageViews: Record<string, number> = {};
      const dailyData: Record<string, { views: number; sessions: Set<string> }> = {};
      
      data?.forEach(event => {
        if (event.session_id) sessions.add(event.session_id);
        if (event.page_path) {
          pageViews[event.page_path] = (pageViews[event.page_path] || 0) + 1;
        }
        
        const dateKey = format(parseISO(event.created_at), "yyyy-MM-dd");
        if (!dailyData[dateKey]) {
          dailyData[dateKey] = { views: 0, sessions: new Set() };
        }
        dailyData[dateKey].views++;
        if (event.session_id) dailyData[dateKey].sessions.add(event.session_id);
      });

      const topPages = Object.entries(pageViews)
        .map(([path, views]) => ({ path, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      const chartData = Object.entries(dailyData)
        .map(([date, stats]) => ({
          date: format(parseISO(date), "MMM d"),
          views: stats.views,
          visitors: stats.sessions.size,
          rawDate: date,
        }))
        .sort((a, b) => a.rawDate.localeCompare(b.rawDate));

      return {
        totalPageviews: data?.length || 0,
        totalVisitors: sessions.size,
        avgPagesPerVisit: sessions.size > 0 ? (data?.length || 0) / sessions.size : 0,
        topPages,
        chartData,
      };
    },
  });

  // Fetch Easter egg discoveries count for date range
  const { data: easterEggCount } = useQuery({
    queryKey: ["easter-egg-discoveries", dateRange.from.toISOString(), dateRange.to.toISOString()],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("analytics_events")
        .select("*", { count: "exact", head: true })
        .eq("event_type", "easter_egg_discovery")
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString());
      if (error) throw error;
      return count || 0;
    },
  });

  // New vs Returning visitors for date range
  const { data: visitorStats } = useQuery({
    queryKey: ["visitor-stats", dateRange.from.toISOString(), dateRange.to.toISOString()],
    queryFn: async () => {
      // Get all unique visitor_ids in the date range
      const { data: currentVisitors, error: currentError } = await supabase
        .from("analytics_events")
        .select("visitor_id")
        .eq("event_type", "page_view")
        .not("visitor_id", "is", null)
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString());
      
      if (currentError) throw currentError;
      
      // Get unique visitor IDs from the current period
      const uniqueVisitorIds = [...new Set(currentVisitors?.map(v => v.visitor_id).filter(Boolean))];
      
      if (uniqueVisitorIds.length === 0) {
        return { newVisitors: 0, returningVisitors: 0 };
      }
      
      // Check which visitors existed before the date range
      const { data: previousVisitors, error: prevError } = await supabase
        .from("analytics_events")
        .select("visitor_id")
        .eq("event_type", "page_view")
        .not("visitor_id", "is", null)
        .lt("created_at", dateRange.from.toISOString())
        .in("visitor_id", uniqueVisitorIds);
      
      if (prevError) throw prevError;
      
      const returningVisitorIds = new Set(previousVisitors?.map(v => v.visitor_id).filter(Boolean));
      const returningCount = uniqueVisitorIds.filter(id => returningVisitorIds.has(id)).length;
      const newCount = uniqueVisitorIds.length - returningCount;
      
      return { newVisitors: newCount, returningVisitors: returningCount };
    },
  });

  // Contact submissions count for date range
  const { data: contactCount } = useQuery({
    queryKey: ["contact-count", dateRange.from.toISOString(), dateRange.to.toISOString()],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("contact_submissions")
        .select("*", { count: "exact", head: true })
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString());
      if (error) throw error;
      return count || 0;
    },
  });

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const { error } = await supabase.functions.invoke("sync-analytics");
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

  const handlePresetChange = (preset: DatePreset) => {
    setDatePreset(preset);
    if (preset !== "custom") {
      setCustomRange(undefined);
    }
  };

  const handleCustomRangeSelect = (range: DateRange | undefined) => {
    setCustomRange(range);
    if (range?.from && range?.to) {
      setIsCalendarOpen(false);
    }
  };

  const chartConfig = {
    views: { label: "Pageviews", color: "hsl(var(--primary))" },
    visitors: { label: "Visitors", color: "hsl(var(--accent))" },
  };

  // Use live data from page views if available
  const totalVisitors = pageViewStats?.totalVisitors || snapshot?.total_visitors || 0;
  const totalPageviews = pageViewStats?.totalPageviews || snapshot?.total_pageviews || 0;
  const avgPagesPerVisit = pageViewStats?.avgPagesPerVisit || snapshot?.avg_pages_per_visit || 0;
  const avgSessionDuration = snapshot?.avg_session_duration_seconds || 0;
  const bounceRate = snapshot?.bounce_rate || 0;
  const topPages = pageViewStats?.topPages || snapshot?.top_pages || [];
  const trafficSources = snapshot?.traffic_sources || [];
  const devices = snapshot?.devices || [];
  const countries = snapshot?.countries || [];
  const chartData = pageViewStats?.chartData || [];

  const lastSyncDate = snapshot?.created_at 
    ? format(parseISO(snapshot.created_at), "MMM d, yyyy 'at' h:mm a")
    : "Never";

  const dateRangeLabel = datePreset === "custom" && customRange?.from
    ? `${format(customRange.from, "MMM d")}${customRange.to ? ` - ${format(customRange.to, "MMM d")}` : ""}`
    : datePreset === "7d" ? "Last 7 days" : datePreset === "30d" ? "Last 30 days" : "Last 90 days";

  return (
    <div className="space-y-6">
      {/* Header with Date Range Picker */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Auto-synced daily at midnight UTC
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {/* Preset Buttons */}
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
            <Button
              variant={datePreset === "7d" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => handlePresetChange("7d")}
              className="h-7 text-xs"
            >
              7D
            </Button>
            <Button
              variant={datePreset === "30d" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => handlePresetChange("30d")}
              className="h-7 text-xs"
            >
              30D
            </Button>
            <Button
              variant={datePreset === "90d" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => handlePresetChange("90d")}
              className="h-7 text-xs"
            >
              90D
            </Button>
            
            {/* Custom Date Range Picker */}
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={datePreset === "custom" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setDatePreset("custom")}
                  className={cn("h-7 text-xs gap-1", datePreset === "custom" && "min-w-[120px]")}
                >
                  <CalendarIcon className="h-3 w-3" />
                  {datePreset === "custom" && customRange?.from ? (
                    <span className="truncate">{dateRangeLabel}</span>
                  ) : (
                    "Custom"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={customRange}
                  onSelect={handleCustomRangeSelect}
                  numberOfMonths={2}
                  disabled={(date) => date > new Date()}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleManualSync}
            disabled={isSyncing}
            className="h-7"
          >
            <RefreshCw className={cn("h-3 w-3 mr-1", isSyncing && "animate-spin")} />
            {isSyncing ? "Syncing..." : "Sync"}
          </Button>
        </div>
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
              {dateRangeLabel}
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
            <CardTitle className="text-sm font-medium text-muted-foreground">New vs Returning</CardTitle>
            <UserPlus className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {visitorStats && (visitorStats.newVisitors + visitorStats.returningVisitors) > 0
                ? `${Math.round((visitorStats.newVisitors / (visitorStats.newVisitors + visitorStats.returningVisitors)) * 100)}%`
                : "0%"} new
            </div>
            <p className="text-xs text-muted-foreground">
              {visitorStats?.newVisitors || 0} new, {visitorStats?.returningVisitors || 0} returning
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 3 }} name="Pageviews" />
                    <Line type="monotone" dataKey="visitors" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ fill: "hsl(var(--accent))", strokeWidth: 0, r: 3 }} name="Visitors" />
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
                No data for selected period.
              </div>
            )}
          </CardContent>
        </Card>

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
                        <div className="h-full bg-primary rounded-full" style={{ width: `${(page.views / (topPages[0]?.views || 1)) * 100}%` }} />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">{page.views}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                No page data for selected period.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              {dateRangeLabel}
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
              Submissions in {dateRangeLabel.toLowerCase()}
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
