import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useBrandState } from "@/lib/brand-state";
import { demoBrandSentiment, demoBrandContentPosts } from "@/lib/mock-data";
import type { SentimentLabel } from "@/lib/mock-data";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft, Brain, ThumbsUp, ThumbsDown, Minus,
  MessageCircle, TrendingUp, Sparkles, Hash,
  SmilePlus, Frown, Meh,
} from "lucide-react";

const sentimentColors: Record<SentimentLabel, string> = {
  positive: "hsl(150, 60%, 45%)",
  neutral: "hsl(35, 80%, 55%)",
  negative: "hsl(0, 70%, 55%)",
};

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-lg p-3 shadow-lg text-xs">
      <p className="font-medium mb-1">
        {new Date(label).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
      </p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2 text-muted-foreground">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="capitalize">{entry.dataKey}:</span>
          <span className="font-medium text-foreground">{entry.value}%</span>
        </div>
      ))}
    </div>
  );
}

export default function BrandSentiment() {
  const [, params] = useRoute("/brand/campaigns/:id/sentiment");
  const { campaigns } = useBrandState();
  const campaign = campaigns.find((c) => c.id === params?.id);
  const sentiment = params?.id === demoBrandSentiment.campaign_id ? demoBrandSentiment : null;
  const posts = demoBrandContentPosts.filter((p) => p.campaign_id === params?.id);

  // Collect all comments across posts
  const allComments = posts.flatMap((p) => p.comments);
  const topPositive = allComments.filter((c) => c.sentiment === "positive").sort((a, b) => b.likes - a.likes).slice(0, 5);
  const topNegative = allComments.filter((c) => c.sentiment === "negative").sort((a, b) => b.likes - a.likes).slice(0, 5);

  if (!sentiment) {
    return (
      <div className="p-6 text-center">
        <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm font-medium mb-1">No sentiment data available</p>
        <p className="text-xs text-muted-foreground">Sentiment analysis will be available once the campaign has comments.</p>
        <Link href="/brand/dashboard">
          <Button variant="link" size="sm" className="mt-2">← Back to dashboard</Button>
        </Link>
      </div>
    );
  }

  const scoreColor = sentiment.overall_score >= 0.5
    ? "text-emerald-600 dark:text-emerald-400"
    : sentiment.overall_score >= 0
      ? "text-amber-600 dark:text-amber-400"
      : "text-red-600 dark:text-red-400";

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1100px]" data-testid="brand-sentiment-page">
      <Link href={`/brand/campaigns/${params?.id}`}>
        <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to campaign
        </Button>
      </Link>

      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Brain className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Sentiment Tracker</h1>
          <p className="text-sm text-muted-foreground">
            AI analysis of {sentiment.total_comments_analysed.toLocaleString()} comments — {campaign?.title}
          </p>
        </div>
      </div>

      {/* Score overview */}
      <div className="grid sm:grid-cols-4 gap-3">
        <Card className="border border-border/60 sm:col-span-1">
          <CardContent className="p-4 text-center">
            <div className={`text-3xl font-bold ${scoreColor} mb-1`}>
              {(sentiment.overall_score * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground mb-2">Overall Score</p>
            <Badge variant="secondary" className={`text-[10px] ${
              sentiment.overall_label === "positive" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : sentiment.overall_label === "neutral" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              : "bg-red-500/10 text-red-600 dark:text-red-400"
            }`}>
              {sentiment.overall_label.charAt(0).toUpperCase() + sentiment.overall_label.slice(1)}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border border-border/60 sm:col-span-3">
          <CardContent className="p-4 space-y-3">
            {[
              { label: "Positive", pct: sentiment.positive_pct, color: "bg-emerald-500", icon: SmilePlus, textColor: "text-emerald-600 dark:text-emerald-400" },
              { label: "Neutral", pct: sentiment.neutral_pct, color: "bg-amber-500", icon: Meh, textColor: "text-amber-600 dark:text-amber-400" },
              { label: "Negative", pct: sentiment.negative_pct, color: "bg-red-500", icon: Frown, textColor: "text-red-600 dark:text-red-400" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <s.icon className={`h-4 w-4 ${s.textColor} shrink-0`} />
                <span className="text-xs font-medium w-16 shrink-0">{s.label}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${s.color} rounded-full transition-all`} style={{ width: `${s.pct}%` }} />
                </div>
                <span className={`text-sm font-semibold ${s.textColor} w-10 text-right shrink-0`}>{s.pct}%</span>
              </div>
            ))}
            <p className="text-[10px] text-muted-foreground pt-1">Based on {sentiment.total_comments_analysed.toLocaleString()} comments analysed</p>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment over time chart */}
      <Card className="border border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Sentiment Over Time</CardTitle>
          <p className="text-[10px] text-muted-foreground">Daily breakdown of comment sentiment</p>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sentiment.daily_sentiment} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <defs>
                  <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={sentimentColors.positive} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={sentimentColors.positive} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="neuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={sentimentColors.neutral} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={sentimentColors.neutral} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="negGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={sentimentColors.negative} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={sentimentColors.negative} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) => new Date(v).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  width={40}
                  domain={[0, 100]}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="positive" stroke={sentimentColors.positive} strokeWidth={2} fill="url(#posGrad)" />
                <Area type="monotone" dataKey="neutral" stroke={sentimentColors.neutral} strokeWidth={2} fill="url(#neuGrad)" />
                <Area type="monotone" dataKey="negative" stroke={sentimentColors.negative} strokeWidth={2} fill="url(#negGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-3">
            {[
              { label: "Positive", color: sentimentColors.positive },
              { label: "Neutral", color: sentimentColors.neutral },
              { label: "Negative", color: sentimentColors.negative },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Summary */}
      <Card className="border border-primary/20 bg-primary/3">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">AI Analysis</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
            {sentiment.ai_summary}
          </div>
        </CardContent>
      </Card>

      {/* Keywords */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="border border-border/60">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-sm font-semibold">Top Positive Keywords</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {sentiment.top_positive_keywords.map((kw) => (
                <Badge key={kw} variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                  {kw}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <ThumbsDown className="h-4 w-4 text-red-600" />
              <CardTitle className="text-sm font-semibold">Top Negative Keywords</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {sentiment.top_negative_keywords.map((kw) => (
                <Badge key={kw} variant="secondary" className="text-[10px] bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20">
                  {kw}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top comments by sentiment */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="border border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Top Positive Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topPositive.map((c) => (
              <div key={c.id} className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <p className="text-xs text-muted-foreground leading-relaxed">"{c.text}"</p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                  <span className="font-medium text-foreground">@{c.username}</span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5"><ThumbsUp className="h-2.5 w-2.5" /> {c.likes.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Top Negative Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topNegative.map((c) => (
              <div key={c.id} className="p-2.5 rounded-lg bg-red-500/5 border border-red-500/10">
                <p className="text-xs text-muted-foreground leading-relaxed">"{c.text}"</p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                  <span className="font-medium text-foreground">@{c.username}</span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5"><ThumbsDown className="h-2.5 w-2.5" /> {c.likes.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
