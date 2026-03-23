import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useAppState } from "@/lib/app-state";
import { earnings, dashboardStats } from "@/lib/mock-data";
import type { Platform } from "@/lib/mock-data";
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  Loader2,
  ArrowUpRight,
  Shield,
} from "lucide-react";
import { SiInstagram, SiTiktok, SiX } from "react-icons/si";

const platformIcons: Record<Platform, typeof SiInstagram> = {
  instagram: SiInstagram,
  tiktok: SiTiktok,
  twitter: SiX,
};

const payoutStatusConfig: Record<string, { color: string; icon: typeof Clock }> = {
  pending: { color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", icon: Clock },
  processing: { color: "bg-blue-500/10 text-blue-600 dark:text-blue-400", icon: Loader2 },
  paid: { color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", icon: CheckCircle2 },
};

export default function Earnings() {
  const { bioVerified } = useAppState();
  const totalEarned = earnings.reduce((sum, e) => sum + e.amount, 0);
  const totalViews = earnings.reduce((sum, e) => sum + e.views, 0);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6" data-testid="earnings-page">
      <div>
        <h1 className="text-xl font-semibold">Earnings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Track your campaign earnings and payout status.
        </p>
      </div>

      {/* Bio bonus callout */}
      {!bioVerified && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/15">
          <Shield className="h-4 w-4 text-primary shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-medium">Boost your earnings by 5%</p>
            <p className="text-[11px] text-muted-foreground">Add postie@postie.app to your bio to unlock the Bio Bonus on all campaigns.</p>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Total Earned",
            value: `£${totalEarned.toFixed(2)}`,
            icon: DollarSign,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Pending",
            value: `£${dashboardStats.pending_earnings.toFixed(2)}`,
            icon: Clock,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-500/10",
          },
          {
            label: "Total Views",
            value: totalViews.toLocaleString(),
            icon: TrendingUp,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-500/10",
          },
          {
            label: "Avg CPM",
            value: `£${dashboardStats.avg_cpm.toFixed(2)}`,
            icon: ArrowUpRight,
            color: "text-primary",
            bg: "bg-primary/10",
          },
        ].map((stat) => (
          <Card key={stat.label} className="border border-border/60" data-testid={`earn-stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}>
            <CardContent className="p-4">
              <div className={`h-8 w-8 rounded-md ${stat.bg} flex items-center justify-center mb-2`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="text-lg font-semibold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Earnings breakdown */}
      <Card className="border border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Earnings Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Desktop table */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Campaign</TableHead>
                  <TableHead className="text-xs">Platform</TableHead>
                  <TableHead className="text-xs">Views</TableHead>
                  <TableHead className="text-xs">CPM</TableHead>
                  <TableHead className="text-xs">Bio Bonus</TableHead>
                  <TableHead className="text-xs">Amount</TableHead>
                  <TableHead className="text-xs">Period</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earnings.map((e) => {
                  const statusCfg = payoutStatusConfig[e.payout_status];
                  const PIcon = platformIcons[e.platform];
                  return (
                    <TableRow key={e.id} data-testid={`earning-row-${e.id}`}>
                      <TableCell className="text-sm font-medium">{e.brand_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <PIcon className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs capitalize">{e.platform}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{e.views.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">£{e.cpm_rate.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`text-[10px] ${e.bio_bonus_applied ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                          {e.bio_bonus_applied ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-semibold">£{e.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(e.period_start).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – {new Date(e.period_end).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`text-[10px] ${statusCfg.color}`}>
                          {e.payout_status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {earnings.map((e) => {
              const statusCfg = payoutStatusConfig[e.payout_status];
              const PIcon = platformIcons[e.platform];
              return (
                <div key={e.id} className="p-3 rounded-lg border border-border/40 space-y-2" data-testid={`earning-mobile-${e.id}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium">{e.brand_name}</span>
                    </div>
                    <Badge variant="secondary" className={`text-[10px] ${statusCfg.color}`}>
                      {e.payout_status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide mb-0.5">Views</p>
                      <p className="font-medium text-foreground">{e.views.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide mb-0.5">CPM</p>
                      <p className="font-medium text-foreground">£{e.cpm_rate.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide mb-0.5">Earned</p>
                      <p className="font-semibold text-foreground">£{e.amount.toFixed(2)}</p>
                    </div>
                  </div>
                  <Progress value={e.payout_status === "paid" ? 100 : e.payout_status === "processing" ? 60 : 30} className="h-1" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
