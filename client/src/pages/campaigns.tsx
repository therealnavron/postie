import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppState } from "@/lib/app-state";
import { availableCampaigns, activeCampaigns, connectedAccount } from "@/lib/mock-data";
import type { Campaign, ActiveCampaign, Platform, PostType, MediaType } from "@/lib/mock-data";
import {
  Copy,
  Calendar as CalIcon,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Eye,
  DollarSign,
  Clock,
  Image as ImageIcon,
  Film,
  Layers,
  Hash,
  Shield,
  Zap,
  Timer,
  MapPin,
} from "lucide-react";
import { SiInstagram, SiTiktok, SiX } from "react-icons/si";

const platformIcons: Record<Platform, typeof SiInstagram> = { instagram: SiInstagram, tiktok: SiTiktok, twitter: SiX };

const statusConfig: Record<string, { color: string; label: string }> = {
  open: { color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", label: "Open" },
  upcoming: { color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20", label: "Upcoming" },
  active: { color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20", label: "Active" },
  completed: { color: "bg-muted text-muted-foreground border-border", label: "Completed" },
};

const mediaIcons: Record<MediaType, typeof ImageIcon> = {
  image: ImageIcon,
  video: Film,
  slideshow: Layers,
};

const postTypeLabels: Record<PostType, string> = {
  story: "Story",
  highlight: "Highlight",
  profile_picture: "Profile Picture",
  video: "Video",
  slideshow: "Slideshow",
  single_image: "Single Image",
  reel: "Reel",
  thread: "Thread",
};

function CampaignCard({ campaign, isJoined, onJoin }: { campaign: Campaign; isJoined: boolean; onJoin?: () => void }) {
  const [joining, setJoining] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const PlatformIcon = platformIcons[campaign.posting_to.platform];
  const MediaIcon = mediaIcons[campaign.media.type];
  const status = statusConfig[campaign.status] || statusConfig.open;
  const spotsLeft = campaign.spots_total - campaign.spots_filled;

  // Estimated earnings based on user's average recent views
  const estEarnings = (connectedAccount.avg_recent_views / 1000) * campaign.cpm_rate;
  const estEarningsBio = (connectedAccount.avg_recent_views / 1000) * campaign.bio_bonus_cpm_rate;

  const handleJoin = () => {
    setJoining(true);
    setTimeout(() => { setJoining(false); onJoin?.(); }, 800);
  };

  const fullCaption = campaign.caption + " " + campaign.hashtags.join(" ");

  const copyCaption = () => {
    navigator.clipboard.writeText(fullCaption).catch(() => {});
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
            {/* Title + status + match */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-sm font-semibold">{campaign.title}</h3>
              <Badge variant="outline" className={`text-[10px] ${status.color}`}>{status.label}</Badge>
              {campaign.match_score && (
                <Badge variant="secondary" className="text-[9px] h-4 px-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {campaign.match_score}% match
                </Badge>
              )}
            </div>

            {/* Brand + category */}
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-2">
              <span className="font-medium text-foreground">{campaign.brand_name}</span>
              <span>·</span>
              <span>{campaign.category}</span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed mb-3">{campaign.description}</p>

            {/* What's being posted — media + placement info */}
            <div className="bg-muted/40 rounded-lg p-3 mb-3 space-y-2.5">
              {/* Post details row */}
              <div className="flex items-start gap-2">
                <MediaIcon className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium">{campaign.media.description}</p>
                  {campaign.media.count && campaign.media.count > 1 && (
                    <p className="text-[10px] text-muted-foreground">{campaign.media.count} {campaign.media.type === "slideshow" ? "slides" : "items"}</p>
                  )}
                </div>
              </div>

              {/* Posting to */}
              <div className="flex items-center gap-2">
                <PlatformIcon className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="text-[10px] text-muted-foreground">
                  Posting to <span className="font-medium text-foreground">{campaign.posting_to.placement}</span> on <span className="capitalize font-medium text-foreground">{campaign.posting_to.platform === "twitter" ? "X" : campaign.posting_to.platform}</span>
                </span>
              </div>

              {/* Auto-post + keep duration */}
              <div className="flex items-center gap-3 flex-wrap">
                {campaign.auto_post && (
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-amber-500" />
                    <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">Auto-posted for you</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Timer className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">Keep up for <span className="font-medium text-foreground">{campaign.keep_days} day{campaign.keep_days !== 1 ? "s" : ""}</span></span>
                </div>
              </div>
            </div>

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
              {/* Hashtags */}
              <div className="flex items-center gap-1.5 flex-wrap mt-2">
                {campaign.hashtags.map((tag) => (
                  <span key={tag} className="text-[10px] text-primary font-medium">{tag}</span>
                ))}
              </div>
            </div>

            {/* Estimated earnings highlight */}
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/15 mb-3">
              <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Est. £{estEarnings.toFixed(2)}/post</p>
                <p className="text-[10px] text-muted-foreground">Based on your ~{connectedAccount.avg_recent_views.toLocaleString()} avg views · £{campaign.cpm_rate.toFixed(2)} CPM{campaign.bio_bonus_cpm_rate > campaign.cpm_rate ? ` · Bio bonus: £${estEarningsBio.toFixed(2)}` : ""}</p>
              </div>
            </div>

            {/* Details row */}
            <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{connectedAccount.avg_recent_views.toLocaleString()} avg views</span>
              <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />£{campaign.cpm_rate.toFixed(2)} CPM</span>
              <span className="text-primary font-medium">Bio: £{campaign.bio_bonus_cpm_rate.toFixed(2)}</span>
              <span className="flex items-center gap-1"><CalIcon className="h-3 w-3" />{new Date(campaign.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – {new Date(campaign.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
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
                  {joining ? "Joining..." : "Join Campaign"}
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

function ActiveCampaignCard({ campaign }: { campaign: ActiveCampaign }) {
  const PlatformIcon = platformIcons[campaign.posting_to.platform];
  const isAutoPosted = campaign.user_status === "auto_posted";

  // Calculate keep-until date if posted
  let keepUntil: Date | null = null;
  let daysRemaining: number | null = null;
  if (campaign.posted_date && campaign.keep_days) {
    keepUntil = new Date(campaign.posted_date);
    keepUntil.setDate(keepUntil.getDate() + campaign.keep_days);
    const now = new Date();
    daysRemaining = Math.max(0, Math.ceil((keepUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  }

  return (
    <Card className="border border-border/60" data-testid={`active-${campaign.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold" style={{ backgroundColor: campaign.brand_color }}>
            {campaign.brand_logo_initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-sm font-semibold">{campaign.title}</h3>
              <Badge variant="outline" className={`text-[10px] ${
                isAutoPosted
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : campaign.user_status === "posted"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
              }`}>
                {isAutoPosted ? "auto-posted" : campaign.user_status}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-2">
              <span>{campaign.brand_name}</span>
              <span>·</span>
              <PlatformIcon className="h-2.5 w-2.5" />
              <span>{postTypeLabels[campaign.post_type]}</span>
              <span>·</span>
              <span>{campaign.posting_to.placement}</span>
              <span>·</span>
              <span>£{campaign.cpm_rate.toFixed(2)} CPM</span>
            </div>

            {/* Auto-post notice */}
            {campaign.auto_post && (
              <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 mb-2">
                <Zap className="h-3 w-3" />
                <span className="font-medium">Auto-posted to your account</span>
              </div>
            )}

            {/* Views + earnings for posted campaigns */}
            {campaign.views !== undefined && campaign.earned !== undefined && (
              <div className="flex items-center gap-4 text-xs mb-2">
                <span className="flex items-center gap-1"><Eye className="h-3 w-3 text-muted-foreground" />{campaign.views.toLocaleString()} views</span>
                <span className="flex items-center gap-1 font-semibold"><DollarSign className="h-3 w-3 text-emerald-600" />£{campaign.earned.toFixed(2)}</span>
              </div>
            )}

            {/* Keep duration countdown */}
            {daysRemaining !== null && daysRemaining > 0 && (
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-xs">
                <Timer className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px]">Keep post up for {campaign.keep_days} days</span>
                    <span className="text-[10px] font-medium">{daysRemaining} day{daysRemaining !== 1 ? "s" : ""} left</span>
                  </div>
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/60 rounded-full transition-all"
                      style={{ width: `${((campaign.keep_days - daysRemaining) / campaign.keep_days) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {daysRemaining === 0 && campaign.posted_date && (
              <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                <span className="font-medium">Keep period complete — you can remove the post</span>
              </div>
            )}

            {/* Scheduled date for upcoming */}
            {campaign.scheduled_date && campaign.user_status === "scheduled" && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3" />
                Auto-posting on {new Date(campaign.scheduled_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </div>
            )}
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
        <p className="text-sm text-muted-foreground mt-0.5">Discover campaigns — we auto-post on your behalf, you earn per view.</p>
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
            <ActiveCampaignCard key={c.id} campaign={c} />
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
