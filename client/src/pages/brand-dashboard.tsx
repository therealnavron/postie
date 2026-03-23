import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBrandState } from "@/lib/brand-state";
import type { BrandCampaign } from "@/lib/mock-data";
import {
  Eye,
  DollarSign,
  Users,
  FileText,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Wallet,
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

function CampaignRow({ campaign }: { campaign: BrandCampaign }) {
  const status = statusConfig[campaign.status] || statusConfig.active;
  const budgetPct = campaign.budget > 0 ? Math.min(100, (campaign.spent / campaign.budget) * 100) : 0;

  return (
    <Link href={`/brand/campaigns/${campaign.id}`}>
      <Card className="border border-border/60 hover:border-border transition-colors cursor-pointer" data-testid={`brand-campaign-${campaign.id}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="text-sm font-semibold">{campaign.title}</h3>
                <Badge variant="outline" className={`text-[10px] ${status.color}`}>{status.label}</Badge>
                <Badge variant="secondary" className="text-[10px]">{styleLabels[campaign.style]}</Badge>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span>{new Date(campaign.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – {new Date(campaign.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                <span>·</span>
                <span>£{campaign.cpm_rate.toFixed(2)} CPM</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-blue-500/10 flex items-center justify-center">
                <Eye className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-semibold">{campaign.total_views.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">Views</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-semibold">£{campaign.spent.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">Spent</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-purple-500/10 flex items-center justify-center">
                <Users className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs font-semibold">{campaign.total_unique_accounts.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">Accounts</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-amber-500/10 flex items-center justify-center">
                <FileText className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-semibold">{campaign.total_unique_posts.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">Posts</p>
              </div>
            </div>
          </div>

          {/* Budget bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary/60 rounded-full transition-all" style={{ width: `${budgetPct}%` }} />
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0">
              £{campaign.spent.toLocaleString()} / £{campaign.budget.toLocaleString()} ({budgetPct.toFixed(0)}%)
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function BrandDashboard() {
  const { brand, campaigns } = useBrandState();

  const totalViews = campaigns.reduce((sum, c) => sum + c.total_views, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalAccounts = campaigns.reduce((sum, c) => sum + c.total_unique_accounts, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "active");

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1100px]" data-testid="brand-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold">Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {brand ? `Welcome back, ${brand.contact_name}` : "Manage your campaigns and track performance"}
          </p>
        </div>
        <Link href="/brand/campaigns/new">
          <Button className="gap-1.5" data-testid="brand-new-campaign">
            <PlusCircle className="h-4 w-4" />
            New Campaign
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Views", value: totalViews.toLocaleString(), icon: Eye, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
          { label: "Total Spent", value: `£${totalSpent.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Unique Creators", value: totalAccounts.toLocaleString(), icon: Users, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10" },
          { label: "Balance", value: `£${(brand?.balance || 0).toLocaleString("en-GB", { minimumFractionDigits: 2 })}`, icon: Wallet, color: "text-primary", bg: "bg-primary/10" },
        ].map((s) => (
          <Card key={s.label} className="border border-border/60" data-testid={`brand-stat-${s.label.toLowerCase().replace(/\s/g, "-")}`}>
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

      {/* Campaign list */}
      {campaigns.length > 0 ? (
        <div className="space-y-3">
          {/* Active first, then rest */}
          {[...campaigns]
            .sort((a, b) => {
              const order = { active: 0, scheduled: 1, draft: 2, completed: 3 };
              return (order[a.status] ?? 4) - (order[b.status] ?? 4);
            })
            .map((c) => (
              <CampaignRow key={c.id} campaign={c} />
            ))}
        </div>
      ) : (
        <Card className="border border-border/60">
          <CardContent className="p-12 text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-sm font-semibold mb-1">No campaigns yet</h3>
            <p className="text-xs text-muted-foreground mb-4">Create your first campaign to start reaching creators.</p>
            <Link href="/brand/campaigns/new">
              <Button className="gap-1.5">
                <PlusCircle className="h-4 w-4" />
                Create Campaign
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
