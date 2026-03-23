import { Link } from "wouter";
import { PostieLogoFull } from "@/components/PostieLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import { useTheme } from "@/lib/theme";
import {
  DollarSign,
  BarChart3,
  Calendar,
  Shield,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  TrendingUp,
  Users,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { SiInstagram, SiTiktok, SiX } from "react-icons/si";

export default function Landing() {
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-background" data-testid="landing-page">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <PostieLogoFull />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} className="h-8 w-8" data-testid="theme-toggle">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Link href="/onboarding">
              <Button size="sm" className="gap-1.5" data-testid="btn-get-started">
                Get Started
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3" />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:py-24 text-center">
          <Badge variant="secondary" className="mb-4 gap-1.5 px-3 py-1">
            <Sparkles className="h-3 w-3" />
            Now in Beta
          </Badge>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-4">
            Get paid to post.
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6 text-sm sm:text-base">
            Connect your social accounts, get matched with brand campaigns, post content, earn per thousand views. No negotiations, no invoicing.
          </p>

          {/* Platform icons */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[
              { icon: SiInstagram, label: "Instagram", color: "text-pink-500" },
              { icon: SiTiktok, label: "TikTok", color: "text-foreground" },
              { icon: SiX, label: "X", color: "text-foreground" },
            ].map((p) => (
              <div key={p.label} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <p.icon className={`h-4 w-4 ${p.color}`} />
                <span>{p.label}</span>
              </div>
            ))}
          </div>

          <Link href="/onboarding">
            <Button size="lg" className="gap-2" data-testid="btn-hero-start">
              <Zap className="h-4 w-4" />
              Get Started — It's Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto max-w-5xl px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { label: "Active Creators", value: "1,200+", icon: Users },
            { label: "Campaigns Run", value: "340", icon: Calendar },
            { label: "Avg CPM", value: "£5.75", icon: TrendingUp },
            { label: "Total Paid Out", value: "£180k+", icon: DollarSign },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <stat.icon className="h-5 w-5 text-primary mb-1" />
              <span className="text-lg font-semibold">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-lg font-semibold mb-8 text-center">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { step: "1", title: "Link your accounts", desc: "Connect Instagram, TikTok, or X. We'll pull your demographics and audience data.", icon: Users },
            { step: "2", title: "Get matched to campaigns", desc: "We match you with brand campaigns that fit your audience. Sign up to the ones you want.", icon: BarChart3 },
            { step: "3", title: "Post & earn", desc: "Post the content on schedule, track your views, and earn a CPM rate. Monthly payouts.", icon: DollarSign },
          ].map((f) => (
            <Card key={f.step} className="border border-border/60 relative" data-testid={`step-${f.step}`}>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">{f.step}</span>
                  </div>
                  <h3 className="font-semibold text-sm">{f.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Bio bonus */}
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Earn 5% more with Bio Bonus</h3>
              <p className="text-sm text-muted-foreground">
                Add <span className="font-medium text-foreground">postie@postie.app</span> to your social bio for a 5% CPM boost on every campaign.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Supported platforms detail */}
      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-lg font-semibold mb-6 text-center">Multi-platform support</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: SiInstagram, name: "Instagram", desc: "Reels, carousels, stories, and feed posts. Business & Creator accounts.", color: "from-pink-500/10 to-purple-500/10", iconColor: "text-pink-500" },
              { icon: SiTiktok, name: "TikTok", desc: "Short-form videos. Login Kit integration for seamless account linking.", color: "from-gray-500/10 to-gray-600/10", iconColor: "text-foreground" },
              { icon: SiX, name: "X (Twitter)", desc: "Threads, posts, and media tweets. OAuth 2.0 with PKCE.", color: "from-blue-500/10 to-cyan-500/10", iconColor: "text-foreground" },
            ].map((p) => (
              <Card key={p.name} className="border border-border/60 overflow-hidden">
                <div className={`h-1.5 bg-gradient-to-r ${p.color}`} />
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <p.icon className={`h-5 w-5 ${p.iconColor}`} />
                    <h3 className="font-semibold text-sm">{p.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <PostieLogoFull />
          <div className="flex items-center gap-4">
            <span>© 2026 Postie</span>
            <PerplexityAttribution />
          </div>
        </div>
      </footer>
    </div>
  );
}
