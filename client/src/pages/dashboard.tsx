import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAppState } from "@/lib/app-state";
import {
  connectedAccount,
  availableCampaigns,
  calendarEvents,
  dashboardStats,
} from "@/lib/mock-data";
import type { PostType } from "@/lib/mock-data";
import {
  DollarSign,
  Eye,
  Megaphone,
  TrendingUp,
  ArrowRight,
  Calendar,
  MapPin,
  Sparkles,
  Clock,
  Zap,
  Timer,
  Film,
  Image as ImageIcon,
  Layers,
} from "lucide-react";
import { SiInstagram, SiTiktok, SiX } from "react-icons/si";

const platformIcons = { instagram: SiInstagram, tiktok: SiTiktok, twitter: SiX };
const statusColors: Record<string, string> = {
  scheduled: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  due_today: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  posted: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

const postTypeLabels: Record<PostType, string> = {
  story: "Story",
  highlight: "Highlight",
  profile_picture: "Profile Pic",
  video: "Video",
  slideshow: "Slideshow",
  single_image: "Image",
  reel: "Reel",
  thread: "Thread",
};

export default function DashboardOverview() {
  const { joinedCampaigns } = useAppState();
  const demo = connectedAccount.demographics;

  // Top matched campaigns (not yet joined, sorted by match score)
  const matched = availableCampaigns
    .filter((c) => !joinedCampaigns.has(c.id) && c.match_score)
    .sort((a, b) => (b.match_score || 0) - (a.match_score || 0))
    .slice(0, 3);

  // Upcoming calendar events (next 5)
  const upcoming = calendarEvents
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1100px]" data-testid="dashboard-overview">
      {/* Stats strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Earnings", value: `£${dashboardStats.total_earnings.toFixed(2)}`, icon: DollarSign, change: "+12%" },
          { label: "Total Views", value: dashboardStats.total_views.toLocaleString(), icon: Eye, change: "+8%" },
          { label: "Active Campaigns", value: dashboardStats.active_campaigns, icon: Megaphone, change: null },
          { label: "Avg CPM", value: `£${dashboardStats.avg_cpm.toFixed(2)}`, icon: TrendingUp, change: "+5%" },
        ].map((s) => (
          <Card key={s.label} className="border border-border/60" data-testid={`stat-${s.label.toLowerCase().replace(/\s/g, '-')}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                  <s.icon className="h-4 w-4 text-primary" />
                </div>
                {s.change && <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">{s.change}</span>}
              </div>
              <p className="text-lg font-semibold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Demographics panel */}
        <Card className="lg:col-span-2 border border-border/60">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">AD</div>
              <div>
                <CardTitle className="text-sm font-semibold">@{connectedAccount.username}</CardTitle>
                <p className="text-[11px] text-muted-foreground">{connectedAccount.followers.toLocaleString()} followers · {connectedAccount.engagement_rate}% engagement</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2 space-y-4">
            {/* Age */}
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Age Distribution</p>
              <div className="space-y-1.5">
                {demo.age_groups.filter(a => a.pct > 5).map((a) => (
                  <div key={a.label} className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-10">{a.label}</span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${a.pct}%` }} />
                    </div>
                    <span className="text-[10px] font-medium w-7 text-right">{a.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Gender */}
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Gender</p>
              <div className="flex gap-2">
                {demo.gender.map((g) => (
                  <div key={g.label} className="flex-1 p-2 rounded-md bg-muted/50 text-center">
                    <p className="text-sm font-semibold">{g.pct}%</p>
                    <p className="text-[10px] text-muted-foreground">{g.label}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Top countries */}
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Top Locations</p>
              <div className="space-y-1">
                {demo.top_countries.slice(0, 4).map((c) => (
                  <div key={c.code} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-2.5 w-2.5 text-muted-foreground" />
                      <span>{c.name}</span>
                    </div>
                    <span className="text-muted-foreground">{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommended campaigns */}
        <Card className="lg:col-span-3 border border-border/60">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">Recommended for You</CardTitle>
              </div>
              <Link href="/dashboard/campaigns">
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" data-testid="btn-view-all-campaigns">
                  View all <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-1 space-y-2">
            {matched.map((c) => {
              const PlatformIcon = platformIcons[c.posting_to.platform];
              return (
                <div key={c.id} className="p-3 rounded-lg border border-border/40 hover:border-border/80 transition-colors" data-testid={`matched-${c.id}`}>
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold" style={{ backgroundColor: c.brand_color }}>
                      {c.brand_logo_initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-sm font-medium truncate">{c.title}</h4>
                        <Badge variant="secondary" className="text-[9px] h-4 px-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                          {c.match_score}% match
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1.5">
                        <span>{c.brand_name}</span>
                        <span>·</span>
                        <PlatformIcon className="h-2.5 w-2.5" />
                        <span>{postTypeLabels[c.post_type]}</span>
                        <span>·</span>
                        <span>£{c.cpm_rate.toFixed(2)} CPM</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Zap className="h-2.5 w-2.5 text-amber-500" />
                          Auto-posted
                        </span>
                        <span className="flex items-center gap-1">
                          <Timer className="h-2.5 w-2.5" />
                          {c.keep_days}d keep
                        </span>
                        <span className="flex items-center gap-1 ml-auto">
                          <span className="w-12 h-1 bg-muted rounded-full overflow-hidden inline-block">
                            <span className="block h-full bg-primary/60 rounded-full" style={{ width: `${(c.spots_filled / c.spots_total) * 100}%` }} />
                          </span>
                          {c.spots_total - c.spots_filled} spots
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Content calendar preview */}
      <Card className="border border-border/60">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold">Content Calendar</CardTitle>
            </div>
            <Link href="/dashboard/calendar">
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                Full calendar <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-1">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {upcoming.map((evt) => {
              const PlatformIcon = platformIcons[evt.platform];
              const isToday = evt.status === "due_today";
              return (
                <div
                  key={evt.id}
                  className={`p-3 rounded-lg border ${isToday ? "border-amber-500/30 bg-amber-500/5" : "border-border/40"}`}
                  data-testid={`cal-${evt.id}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-medium ${isToday ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}>
                      {isToday ? "Due today" : new Date(evt.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
                    </span>
                    <Badge variant="secondary" className={`text-[9px] h-4 px-1.5 ${statusColors[evt.status]}`}>
                      {evt.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-xs font-medium truncate mb-0.5">{evt.campaign_title}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <PlatformIcon className="h-2.5 w-2.5" />
                    <span>{evt.brand_name}</span>
                    {evt.time && (
                      <>
                        <span>·</span>
                        <Clock className="h-2.5 w-2.5" />
                        <span>{evt.time}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[9px] text-muted-foreground">
                    {evt.auto_post && <Zap className="h-2 w-2 text-amber-500" />}
                    <span>{postTypeLabels[evt.post_type]}</span>
                    {evt.auto_post && <span>· auto</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
