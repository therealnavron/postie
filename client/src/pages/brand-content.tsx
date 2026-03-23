import { Link, useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBrandState } from "@/lib/brand-state";
import { demoBrandContentPosts } from "@/lib/mock-data";
import type { ContentPost, Platform, PostType } from "@/lib/mock-data";
import {
  ArrowLeft,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Film,
  Image as ImageIcon,
  Layers,
  Play,
} from "lucide-react";
import { SiInstagram, SiTiktok, SiX } from "react-icons/si";

const platformIcons: Record<Platform, typeof SiInstagram> = {
  instagram: SiInstagram,
  tiktok: SiTiktok,
  twitter: SiX,
};

const postTypeLabels: Record<PostType, string> = {
  story: "Story", highlight: "Highlight", profile_picture: "Profile Pic",
  video: "Video", slideshow: "Carousel", single_image: "Image",
  reel: "Reel", thread: "Thread",
};

const postTypeIcons: Record<string, typeof Film> = {
  video: Film, reel: Film, slideshow: Layers, single_image: ImageIcon,
  story: Film, highlight: Film, profile_picture: ImageIcon, thread: MessageCircle,
};

function ContentCard({ post }: { post: ContentPost }) {
  const PlatformIcon = platformIcons[post.platform];
  const PostIcon = postTypeIcons[post.post_type] || Film;

  return (
    <Link href={`/brand/content/${post.id}`}>
      <Card className="border border-border/60 hover:border-border transition-all cursor-pointer group" data-testid={`content-card-${post.id}`}>
        <CardContent className="p-0">
          {/* Thumbnail placeholder */}
          <div
            className="relative aspect-[4/3] rounded-t-lg flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: post.thumbnail_color }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <Play className="h-10 w-10 text-white/70 group-hover:text-white/90 group-hover:scale-110 transition-all" />

            {/* Platform + type badge */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5">
              <Badge variant="secondary" className="bg-black/50 text-white border-0 text-[9px] gap-1 backdrop-blur-sm">
                <PlatformIcon className="h-2.5 w-2.5" />
                {post.platform === "twitter" ? "X" : post.platform}
              </Badge>
              <Badge variant="secondary" className="bg-black/50 text-white border-0 text-[9px] gap-1 backdrop-blur-sm">
                <PostIcon className="h-2.5 w-2.5" />
                {postTypeLabels[post.post_type]}
              </Badge>
            </div>

            {/* Views overlay */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-medium">
              <Eye className="h-3 w-3" />
              {post.total_views >= 1_000_000
                ? `${(post.total_views / 1_000_000).toFixed(1)}M`
                : `${(post.total_views / 1_000).toFixed(0)}K`}
            </div>

            {/* Engagement rate */}
            <div className="absolute bottom-2 right-2">
              <Badge variant="secondary" className="bg-emerald-500/80 text-white border-0 text-[9px]">
                {post.engagement_rate}% eng
              </Badge>
            </div>
          </div>

          {/* Info */}
          <div className="p-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shrink-0">
                <span className="text-[8px] font-bold text-white">
                  {post.creator_display_name.split(" ").map(w => w[0]).join("")}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium truncate">{post.creator_display_name}</p>
                <p className="text-[10px] text-muted-foreground">@{post.creator_username}</p>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{post.caption}</p>

            {/* Stats row */}
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground pt-1 border-t border-border/40">
              <span className="flex items-center gap-1">
                <Heart className="h-2.5 w-2.5" />
                {post.total_likes >= 1000 ? `${(post.total_likes / 1000).toFixed(1)}K` : post.total_likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-2.5 w-2.5" />
                {post.total_comments >= 1000 ? `${(post.total_comments / 1000).toFixed(1)}K` : post.total_comments}
              </span>
              <span className="flex items-center gap-1">
                <Share2 className="h-2.5 w-2.5" />
                {post.total_shares >= 1000 ? `${(post.total_shares / 1000).toFixed(1)}K` : post.total_shares}
              </span>
              <span className="ml-auto text-[9px]">
                {new Date(post.posted_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function BrandContent() {
  const [, params] = useRoute("/brand/campaigns/:id/content");
  const { campaigns } = useBrandState();
  const campaign = campaigns.find((c) => c.id === params?.id);
  const posts = demoBrandContentPosts.filter((p) => p.campaign_id === params?.id);

  const totalViews = posts.reduce((s, p) => s + p.total_views, 0);
  const totalLikes = posts.reduce((s, p) => s + p.total_likes, 0);
  const totalComments = posts.reduce((s, p) => s + p.total_comments, 0);
  const avgEngagement = posts.length > 0 ? posts.reduce((s, p) => s + p.engagement_rate, 0) / posts.length : 0;

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1100px]" data-testid="brand-content-page">
      <Link href={`/brand/campaigns/${params?.id}`}>
        <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to campaign
        </Button>
      </Link>

      <div>
        <h1 className="text-xl font-semibold">Content</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {campaign ? campaign.title : "Campaign"} — {posts.length} posts across creators
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Views", value: totalViews >= 1_000_000 ? `${(totalViews / 1_000_000).toFixed(1)}M` : `${(totalViews / 1_000).toFixed(0)}K`, icon: Eye, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
          { label: "Total Likes", value: totalLikes >= 1_000_000 ? `${(totalLikes / 1_000_000).toFixed(1)}M` : `${(totalLikes / 1_000).toFixed(0)}K`, icon: Heart, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-500/10" },
          { label: "Total Comments", value: totalComments >= 1_000 ? `${(totalComments / 1_000).toFixed(1)}K` : totalComments.toString(), icon: MessageCircle, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
          { label: "Avg Engagement", value: `${avgEngagement.toFixed(1)}%`, icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
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

      {/* Content grid */}
      {posts.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts
            .sort((a, b) => b.total_views - a.total_views)
            .map((post) => (
              <ContentCard key={post.id} post={post} />
            ))}
        </div>
      ) : (
        <Card className="border border-border/60">
          <CardContent className="p-12 text-center">
            <Film className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium mb-1">No content yet</p>
            <p className="text-xs text-muted-foreground">Content will appear here once posts go live.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
