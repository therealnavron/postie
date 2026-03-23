import { useState } from "react";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { demoBrandContentPosts } from "@/lib/mock-data";
import type { ContentComment, SentimentLabel, Platform, PostType } from "@/lib/mock-data";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import {
  ArrowLeft, Eye, Heart, MessageCircle, Share2, TrendingUp,
  ThumbsUp, ThumbsDown, Minus, Film, Play, Calendar,
} from "lucide-react";
import { SiInstagram, SiTiktok, SiX } from "react-icons/si";

const platformIcons: Record<Platform, typeof SiInstagram> = {
  instagram: SiInstagram, tiktok: SiTiktok, twitter: SiX,
};

const postTypeLabels: Record<PostType, string> = {
  story: "Story", highlight: "Highlight", profile_picture: "Profile Pic",
  video: "Video", slideshow: "Carousel", single_image: "Image",
  reel: "Reel", thread: "Thread",
};

const sentimentConfig: Record<SentimentLabel, { color: string; icon: typeof ThumbsUp; label: string }> = {
  positive: { color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10", icon: ThumbsUp, label: "Positive" },
  neutral: { color: "text-amber-600 dark:text-amber-400 bg-amber-500/10", icon: Minus, label: "Neutral" },
  negative: { color: "text-red-600 dark:text-red-400 bg-red-500/10", icon: ThumbsDown, label: "Negative" },
};

function CommentRow({ comment }: { comment: ContentComment }) {
  const cfg = sentimentConfig[comment.sentiment];
  const SentIcon = cfg.icon;
  return (
    <div className="flex gap-3 py-3 border-b border-border/30 last:border-0" data-testid={`comment-${comment.id}`}>
      <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0">
        <span className="text-[9px] font-bold text-muted-foreground">
          {comment.username.slice(0, 2).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-medium">@{comment.username}</span>
          <Badge variant="secondary" className={`text-[9px] h-4 px-1.5 gap-0.5 ${cfg.color}`}>
            <SentIcon className="h-2.5 w-2.5" />
            {cfg.label}
          </Badge>
          <span className="text-[10px] text-muted-foreground ml-auto shrink-0">
            {new Date(comment.timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{comment.text}</p>
        <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
          <Heart className="h-2.5 w-2.5" />
          {comment.likes.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

// Custom tooltip for chart
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-lg p-3 shadow-lg text-xs">
      <p className="font-medium mb-1">
        {new Date(label).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
      </p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2 text-muted-foreground">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="capitalize">{entry.dataKey}:</span>
          <span className="font-medium text-foreground">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export default function BrandContentDetail() {
  const [, params] = useRoute("/brand/content/:id");
  const [commentFilter, setCommentFilter] = useState<"all" | SentimentLabel>("all");

  const post = demoBrandContentPosts.find((p) => p.id === params?.id);

  if (!post) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-muted-foreground">Content not found.</p>
        <Link href="/brand/dashboard">
          <Button variant="link" size="sm" className="mt-2">← Back to dashboard</Button>
        </Link>
      </div>
    );
  }

  const PlatformIcon = platformIcons[post.platform];
  const cumulativeViews = post.daily_metrics.reduce<{ date: string; views: number; cumulative: number; likes: number; comments: number; shares: number }[]>((acc, d) => {
    const prev = acc.length > 0 ? acc[acc.length - 1].cumulative : 0;
    acc.push({ ...d, cumulative: prev + d.views });
    return acc;
  }, []);

  const filteredComments = commentFilter === "all"
    ? post.comments
    : post.comments.filter((c) => c.sentiment === commentFilter);

  const sentimentBreakdown = {
    positive: post.comments.filter((c) => c.sentiment === "positive").length,
    neutral: post.comments.filter((c) => c.sentiment === "neutral").length,
    negative: post.comments.filter((c) => c.sentiment === "negative").length,
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1100px]" data-testid="brand-content-detail">
      <Link href={`/brand/campaigns/${post.campaign_id}/content`}>
        <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to content
        </Button>
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4">
        {/* Thumbnail */}
        <div
          className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: post.thumbnail_color }}
        >
          <Play className="h-8 w-8 text-white/70" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Badge variant="secondary" className="text-[10px] gap-1">
              <PlatformIcon className="h-2.5 w-2.5" />
              {post.platform === "twitter" ? "X" : post.platform}
            </Badge>
            <Badge variant="secondary" className="text-[10px]">
              {postTypeLabels[post.post_type]}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shrink-0">
              <span className="text-[8px] font-bold text-white">
                {post.creator_display_name.split(" ").map(w => w[0]).join("")}
              </span>
            </div>
            <span className="text-sm font-semibold">{post.creator_display_name}</span>
            <span className="text-xs text-muted-foreground">@{post.creator_username}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{post.caption}</p>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
            <Calendar className="h-2.5 w-2.5" />
            Posted {new Date(post.posted_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Views", value: post.total_views.toLocaleString(), icon: Eye, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
          { label: "Likes", value: post.total_likes.toLocaleString(), icon: Heart, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-500/10" },
          { label: "Comments", value: post.total_comments.toLocaleString(), icon: MessageCircle, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
          { label: "Shares", value: post.total_shares.toLocaleString(), icon: Share2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
        ].map((s) => (
          <Card key={s.label} className="border border-border/60">
            <CardContent className="p-4">
              <div className={`h-8 w-8 rounded-md ${s.bg} flex items-center justify-center mb-2`}>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className="text-lg font-semibold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="cumulative" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cumulative">Cumulative Views</TabsTrigger>
          <TabsTrigger value="daily">Daily Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="cumulative">
          <Card className="border border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Views Over Time</CardTitle>
              <p className="text-[10px] text-muted-foreground">Cumulative views since the post went live</p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] sm:h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cumulativeViews} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <defs>
                      <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(259, 74%, 56%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(259, 74%, 56%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(v) => new Date(v).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      className="text-[10px]"
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      tickFormatter={(v) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `${(v / 1_000).toFixed(0)}K` : v}
                      className="text-[10px]"
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      width={50}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="cumulative"
                      stroke="hsl(259, 74%, 56%)"
                      strokeWidth={2}
                      fill="url(#viewsGrad)"
                      name="views"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily">
          <Card className="border border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Daily Breakdown</CardTitle>
              <p className="text-[10px] text-muted-foreground">Views, likes, comments, and shares per day</p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] sm:h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={post.daily_metrics} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(v) => new Date(v).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      tickFormatter={(v) => v >= 1_000 ? `${(v / 1_000).toFixed(0)}K` : v}
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      width={45}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="views" fill="hsl(259, 74%, 56%)" radius={[3, 3, 0, 0]} name="views" />
                    <Bar dataKey="likes" fill="hsl(330, 70%, 55%)" radius={[3, 3, 0, 0]} name="likes" />
                    <Bar dataKey="comments" fill="hsl(35, 80%, 55%)" radius={[3, 3, 0, 0]} name="comments" />
                    <Bar dataKey="shares" fill="hsl(150, 60%, 45%)" radius={[3, 3, 0, 0]} name="shares" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Comments */}
      <Card className="border border-border/60">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-sm font-semibold">Comments</CardTitle>
              <p className="text-[10px] text-muted-foreground">{post.comments.length} sample comments shown</p>
            </div>
            <div className="flex items-center gap-1">
              {(["all", "positive", "neutral", "negative"] as const).map((f) => (
                <Button
                  key={f}
                  variant={commentFilter === f ? "default" : "ghost"}
                  size="sm"
                  className="h-7 text-[10px] px-2"
                  onClick={() => setCommentFilter(f)}
                  data-testid={`filter-${f}`}
                >
                  {f === "all" ? `All (${post.comments.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${sentimentBreakdown[f]})`}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredComments.length > 0 ? (
            filteredComments
              .sort((a, b) => b.likes - a.likes)
              .map((c) => <CommentRow key={c.id} comment={c} />)
          ) : (
            <p className="text-xs text-muted-foreground text-center py-6">No {commentFilter} comments found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
