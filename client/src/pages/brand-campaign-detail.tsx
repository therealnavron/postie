import { useState } from "react";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useBrandState } from "@/lib/brand-state";
import {
  ArrowLeft,
  Eye,
  DollarSign,
  Users,
  FileText,
  MapPin,
  TrendingUp,
  PlusCircle,
  Loader2,
  CheckCircle2,
  Calendar,
} from "lucide-react";

const statusConfig: Record<string, { color: string; label: string }> = {
  active: { color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", label: "Active" },
  scheduled: { color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20", label: "Scheduled" },
  completed: { color: "bg-muted text-muted-foreground border-border", label: "Completed" },
  draft: { color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20", label: "Draft" },
};

const styleLabels: Record<string, string> = {
  brand_growth: "Brand Growth",
  viral_content: "Viral Content",
};

export default function BrandCampaignDetail() {
  const [, params] = useRoute("/brand/campaigns/:id");
  const { campaigns, addBudget, brand } = useBrandState();
  const [extendAmount, setExtendAmount] = useState("");
  const [extending, setExtending] = useState(false);
  const [extendSuccess, setExtendSuccess] = useState(false);

  const campaign = campaigns.find((c) => c.id === params?.id);

  if (!campaign) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-muted-foreground">Campaign not found.</p>
        <Link href="/brand/dashboard">
          <Button variant="link" size="sm" className="mt-2">← Back to campaigns</Button>
        </Link>
      </div>
    );
  }

  const status = statusConfig[campaign.status] || statusConfig.active;
  const budgetPct = campaign.budget > 0 ? Math.min(100, (campaign.spent / campaign.budget) * 100) : 0;
  const demo = campaign.demographics;

  const handleExtend = () => {
    const amt = parseFloat(extendAmount);
    if (isNaN(amt) || amt <= 0) return;
    setExtending(true);
    setTimeout(() => {
      addBudget(campaign.id, amt);
      setExtending(false);
      setExtendSuccess(true);
      setExtendAmount("");
      setTimeout(() => setExtendSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1100px]" data-testid="brand-campaign-detail">
      {/* Back */}
      <Link href="/brand/dashboard">
        <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 text-muted-foreground hover:text-foreground" data-testid="brand-back">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to campaigns
        </Button>
      </Link>

      {/* Title + status */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-xl font-semibold">{campaign.title}</h1>
            <Badge variant="outline" className={`text-[10px] ${status.color}`}>{status.label}</Badge>
            <Badge variant="secondary" className="text-[10px]">{styleLabels[campaign.style]}</Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(campaign.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} – {new Date(campaign.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <span>·</span>
            <span>£{campaign.cpm_rate.toFixed(2)} CPM</span>
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Views", value: campaign.total_views.toLocaleString(), icon: Eye, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", note: "±5% estimated" },
          { label: "Total Spent", value: `£${campaign.spent.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", note: `of £${campaign.budget.toLocaleString()} budget` },
          { label: "Unique Accounts", value: campaign.total_unique_accounts.toLocaleString(), icon: Users, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10", note: "creators reached" },
          { label: "Unique Posts", value: campaign.total_unique_posts.toLocaleString(), icon: FileText, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10", note: "across all platforms" },
        ].map((s) => (
          <Card key={s.label} className="border border-border/60" data-testid={`detail-stat-${s.label.toLowerCase().replace(/\s/g, "-")}`}>
            <CardContent className="p-4">
              <div className={`h-8 w-8 rounded-md ${s.bg} flex items-center justify-center mb-2`}>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className="text-lg font-semibold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{s.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Budget bar + extend */}
      <Card className="border border-border/60">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Budget</CardTitle>
            <span className="text-xs text-muted-foreground">{budgetPct.toFixed(0)}% used</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span>£{campaign.spent.toLocaleString()} spent</span>
              <span className="font-medium">£{campaign.budget.toLocaleString()} total</span>
            </div>
            <Progress value={budgetPct} className="h-2" />
          </div>

          {/* Extend budget */}
          {campaign.status === "active" && (
            <div className="flex items-end gap-3 pt-2 border-t border-border/50">
              <div className="flex-1">
                <p className="text-xs font-medium mb-1.5">Extend Budget</p>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">£</span>
                    <Input
                      type="number"
                      value={extendAmount}
                      onChange={(e) => setExtendAmount(e.target.value)}
                      className="pl-7"
                      placeholder="5,000"
                      min={0}
                      step={1000}
                      data-testid="extend-budget-input"
                    />
                  </div>
                  <Button
                    onClick={handleExtend}
                    disabled={extending || !extendAmount || parseFloat(extendAmount) <= 0}
                    className="gap-1.5 shrink-0"
                    data-testid="extend-budget-btn"
                  >
                    {extending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : extendSuccess ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <PlusCircle className="h-4 w-4" />
                    )}
                    {extending ? "Adding..." : extendSuccess ? "Added" : "Add"}
                  </Button>
                </div>
                {brand && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Available balance: £{brand.balance.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Demographics */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Age + Gender */}
        <Card className="border border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Audience Demographics</CardTitle>
            <p className="text-[10px] text-muted-foreground">±5% estimated range</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Age */}
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Age Distribution</p>
              <div className="space-y-1.5">
                {demo.age_groups.map((a) => (
                  <div key={a.label} className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-10">{a.label}</span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${a.pct}%` }} />
                    </div>
                    <span className="text-[10px] font-medium w-10 text-right">{a.pct}%</span>
                    <span className="text-[9px] text-muted-foreground w-14 text-right">±{Math.max(1, Math.round(a.pct * 0.05))}%</span>
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
                    <p className="text-[9px] text-muted-foreground">±{Math.max(1, Math.round(g.pct * 0.05))}%</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Locations */}
        <Card className="border border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Top Locations</CardTitle>
            <p className="text-[10px] text-muted-foreground">±5% estimated range</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Countries */}
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Countries</p>
              <div className="space-y-2">
                {demo.top_countries.map((c) => (
                  <div key={c.code} className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span className="text-xs flex-1">{c.name}</span>
                    <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary/60 rounded-full" style={{ width: `${c.pct * 2}%` }} />
                    </div>
                    <span className="text-xs font-medium w-8 text-right">{c.pct}%</span>
                    <span className="text-[9px] text-muted-foreground w-10 text-right">±{Math.max(1, Math.round(c.pct * 0.05))}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cities */}
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Cities</p>
              <div className="space-y-2">
                {demo.top_cities.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-2.5 w-2.5 text-muted-foreground" />
                      <span>{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{c.pct}%</span>
                      <span className="text-[9px] text-muted-foreground">±{Math.max(1, Math.round(c.pct * 0.05))}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
