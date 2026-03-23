import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppState } from "@/lib/app-state";
import { availableCampaigns, activeCampaigns } from "@/lib/mock-data";
import type { Campaign, Platform } from "@/lib/mock-data";
import {
  Copy,
  Calendar as CalIcon,
  CheckCircle2,
  Users,
  ArrowRight,
  Loader2,
  Eye,
  DollarSign,
  Clock,
} from "lucide-react";
import { SiInstagram, SiTiktok, SiX } from "react-icons/si";

const platformIcons: Record<Platform, typeof SiInstagram> = { instagram: SiInstagram, tiktok: SiTiktok, twitter: SiX };

const statusConfig: Record<string, { color: string; label: string }> = {
  open: { color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", label: "Open" },
  upcoming: { color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20", label: "Upcoming" },
  active: { color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20", label: "Active" },
  completed: { color: "bg-muted text-muted-foreground border-border", label: "Completed" },
};

function CampaignCard({ campaign, isJoined, onJoin }: { campaign: Campaign; isJoined: boolean; onJoin?: () => void }) {
  const [joining, setJoining] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const PlatformIcon = platformIcons[campaign.platform];
  const status = statusConfig[campaign.status] || statusConfig.open;
  const spotsLeft = campaign.spots_total - campaign.spots_filled;

  const handleJoin = () => {
    setJoining(true);
    setTimeout(() => { setJoining(false); onJoin?.(); }, 800);
  };

  const copyCaption = () => {
    navigator.clipboard.writeText(campaign.caption).catch(() => {});
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <Card className="border border-border/60" data-testid={`campaign-${campaign.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold" style={{ backgroundColor: campaign.brand_color }}>
            {campaign.brand_logo_initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-sm font-semibold">{campaign.title}</h3>
              <Badge variant="outline" className={`text-[10px] ${status.color}`}>{status.label}</Badge>
              {campaign.match_score && (
                <Badge variant="secondary" className="text-[9px] h-4 px-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {campaign.match_score}% match
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-2">
              <span className="font-medium text-foreground">{campaign.brand_name}</span>
              <span>·</span>
              <PlatformIcon className="h-2.5 w-2.5" />
              <span>{campaign.content_type}</span>
              <span>·</span>
              <span>{campaign.category}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">{campaign.description}</p>

            {/* Caption */}
            <div className="bg-muted/50 rounded-md p-3 mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Caption</span>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1" onClick={copyCaption} data-testid={`copy-${campaign.id}`}>
                  <Copy className="h-3 w-3" />
                  {copiedId ? "Copied" : "Copy"}
                </Button>
              </div>
              <p className="text-xs leading-relaxed">{campaign.caption}</p>
            </div>

            {/* Details */}
            <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />£{campaign.cpm_rate.toFixed(2)} CPM</span>
              <span className="text-primary">Bio: £{campaign.bio_bonus_cpm_rate.toFixed(2)}</span>
              <span className="flex items-center gap-1"><CalIcon className="h-3 w-3" />{new Date(campaign.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – {new Date(campaign.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{campaign.min_followers.toLocaleString()}+ followers</span>
            </div>

            {/* Spots + action */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary/60 rounded-full" style={{ width: `${(campaign.spots_filled / campaign.spots_total) * 100}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground">{spotsLeft} of {campaign.spots_total} spots left</span>
              </div>
              {!isJoined ? (
                <Button size="sm" className="gap-1.5 h-8" onClick={handleJoin} disabled={joining} data-testid={`join-${campaign.id}`}>
                  {joining ? <Loader2 className="h-3 w-3 animate-spin" /> : <ArrowRight className="h-3 w-3" />}
                  {joining ? "Joining..." : "Sign Up"}
                </Button>
              ) : (
                <Badge variant="secondary" className="gap-1 px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Joined
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Campaigns() {
  const { joinedCampaigns, joinCampaign } = useAppState();

  const discover = availableCampaigns
    .filter((c) => !joinedCampaigns.has(c.id))
    .sort((a, b) => (b.match_score || 0) - (a.match_score || 0));

  const joined = availableCampaigns.filter((c) => joinedCampaigns.has(c.id));

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1100px]" data-testid="campaigns-page">
      <div>
        <h1 className="text-xl font-semibold">Campaigns</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Discover campaigns and sign up to ones that fit your audience.</p>
      </div>

      <Tabs defaultValue="discover" className="space-y-4">
        <TabsList>
          <TabsTrigger value="discover" data-testid="tab-discover">
            Discover
            {discover.length > 0 && <Badge variant="secondary" className="ml-1.5 text-[9px] h-4 px-1.5">{discover.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="active" data-testid="tab-active">
            Active & Upcoming
            {joined.length > 0 && <Badge variant="secondary" className="ml-1.5 text-[9px] h-4 px-1.5">{joined.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-3">
          {discover.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              <p>No new campaigns available right now.</p>
              <p className="text-xs mt-1">Check back soon — we add new campaigns regularly.</p>
            </div>
          ) : (
            discover.map((c) => (
              <CampaignCard key={c.id} campaign={c} isJoined={false} onJoin={() => joinCampaign(c.id)} />
            ))
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-3">
          {/* Active campaigns from activeCampaigns mock */}
          {activeCampaigns.map((c) => (
            <Card key={c.id} className="border border-border/60" data-testid={`active-${c.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold" style={{ backgroundColor: c.brand_color }}>
                    {c.brand_logo_initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-sm font-semibold">{c.title}</h3>
                      <Badge variant="outline" className={`text-[10px] ${c.user_status === "posted" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"}`}>
                        {c.user_status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{c.brand_name} · {c.content_type} · £{c.cpm_rate.toFixed(2)} CPM</p>
                    {c.views && c.earned && (
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3 text-muted-foreground" />{c.views.toLocaleString()} views</span>
                        <span className="flex items-center gap-1 font-semibold"><DollarSign className="h-3 w-3 text-emerald-600" />£{c.earned.toFixed(2)}</span>
                      </div>
                    )}
                    {c.scheduled_date && c.user_status === "scheduled" && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        Post by {new Date(c.scheduled_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Joined campaigns from discover */}
          {joined.map((c) => (
            <CampaignCard key={c.id} campaign={c} isJoined={true} />
          ))}

          {activeCampaigns.length === 0 && joined.length === 0 && (
            <div className="text-center py-12 text-sm text-muted-foreground">
              <p>You haven't joined any campaigns yet.</p>
              <p className="text-xs mt-1">Head to Discover to find campaigns that match your audience.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
