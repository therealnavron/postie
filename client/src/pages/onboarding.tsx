import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { PostieLogoFull } from "@/components/PostieLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "@/lib/theme";
import { useAppState } from "@/lib/app-state";
import { checkPhylloStatus, openPhylloConnect, PHYLLO_PLATFORMS } from "@/lib/phyllo";
import type { Platform } from "@/lib/mock-data";
import {
  ArrowRight,
  CheckCircle2,
  Sun,
  Moon,
  Loader2,
  Users,
  BarChart3,
  Globe,
  Sparkles,
  Zap,
} from "lucide-react";
import { SiInstagram, SiTiktok, SiX } from "react-icons/si";

const platforms: {
  id: Platform;
  name: string;
  icon: typeof SiInstagram;
  color: string;
  bgGradient: string;
  desc: string;
  phylloId: string;
}[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: SiInstagram,
    color: "text-pink-500",
    bgGradient: "from-pink-500/10 to-purple-500/10",
    desc: "Business & Creator accounts",
    phylloId: PHYLLO_PLATFORMS.instagram,
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: SiTiktok,
    color: "text-foreground",
    bgGradient: "from-gray-500/10 to-gray-600/10",
    desc: "All account types",
    phylloId: PHYLLO_PLATFORMS.tiktok,
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: SiX,
    color: "text-foreground",
    bgGradient: "from-blue-500/10 to-blue-600/10",
    desc: "All account types",
    phylloId: PHYLLO_PLATFORMS.twitter,
  },
];

export default function Onboarding() {
  const { theme, toggle } = useTheme();
  const { linkedAccounts, linkAccount } = useAppState();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [connectingPlatform, setConnectingPlatform] = useState<Platform | null>(null);
  const [phylloMode, setPhylloMode] = useState<"live" | "demo">("demo");

  // Check if Phyllo is configured on mount
  useEffect(() => {
    checkPhylloStatus().then((status) => {
      setPhylloMode(status.mode === "live" ? "live" : "demo");
    });
  }, []);

  const loadingSteps = [
    { label: "Connecting to your account...", icon: Globe },
    { label: "Fetching profile data...", icon: Users },
    { label: "Analysing audience demographics...", icon: BarChart3 },
    { label: "Matching you with campaigns...", icon: Sparkles },
  ];

  const handleConnect = async (platform: typeof platforms[0]) => {
    setConnectingPlatform(platform.id);

    if (phylloMode === "live") {
      // Real Phyllo Connect SDK
      try {
        await openPhylloConnect(platform.phylloId, {
          onAccountConnected: (_accountId, _workPlatformId, _userId) => {
            linkAccount(platform.id);
            setConnectingPlatform(null);
          },
          onExit: () => {
            setConnectingPlatform(null);
          },
          onConnectionFailure: () => {
            setConnectingPlatform(null);
          },
        });
      } catch (err) {
        console.error("Phyllo connect error:", err);
        // Fallback to demo mode
        setTimeout(() => {
          linkAccount(platform.id);
          setConnectingPlatform(null);
        }, 1500);
      }
    } else {
      // Demo mode — simulate OAuth flow
      setTimeout(() => {
        linkAccount(platform.id);
        setConnectingPlatform(null);
      }, 1500);
    }
  };

  const handleContinue = () => {
    setLoading(true);
    setLoadingStep(0);
  };

  useEffect(() => {
    if (!loading) return;
    if (loadingStep < loadingSteps.length - 1) {
      const timer = setTimeout(() => setLoadingStep((s) => s + 1), 1200);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setLocation("/dashboard"), 1000);
      return () => clearTimeout(timer);
    }
  }, [loading, loadingStep]);

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="loading-screen">
        <div className="max-w-sm w-full text-center space-y-8">
          <PostieLogoFull className="justify-center" />
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Setting up your dashboard</h2>
              <p className="text-sm text-muted-foreground">This only takes a moment...</p>
            </div>

            <Progress
              value={((loadingStep + 1) / loadingSteps.length) * 100}
              className="h-1.5"
            />

            <div className="space-y-3">
              {loadingSteps.map((step, i) => {
                const StepIcon = step.icon;
                const isDone = i < loadingStep;
                const isCurrent = i === loadingStep;
                return (
                  <div
                    key={step.label}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                      isCurrent ? "bg-primary/5 border border-primary/20" : isDone ? "opacity-60" : "opacity-30"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
                    ) : (
                      <StepIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <span className={`text-sm ${isCurrent ? "font-medium" : ""}`}>{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connected accounts */}
          <div className="flex items-center justify-center gap-2">
            {linkedAccounts.map((p) => {
              const pf = platforms.find((pl) => pl.id === p);
              if (!pf) return null;
              return (
                <Badge key={p} variant="secondary" className="gap-1.5 px-2 py-1">
                  <pf.icon className={`h-3 w-3 ${pf.color}`} />
                  <span className="text-[10px]">{pf.name}</span>
                </Badge>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="onboarding-page">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <PostieLogoFull />
          <div className="flex items-center gap-2">
            {phylloMode === "demo" && (
              <Badge variant="outline" className="text-[9px] h-5 px-1.5 gap-1 border-amber-500/30 text-amber-600 dark:text-amber-400">
                <Zap className="h-2.5 w-2.5" />
                Demo Mode
              </Badge>
            )}
            <Button variant="ghost" size="icon" onClick={toggle} className="h-8 w-8">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 py-12 sm:py-20">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          <div className="h-1.5 flex-1 rounded-full bg-primary" />
          <div className={`h-1.5 flex-1 rounded-full transition-colors ${linkedAccounts.length > 0 ? "bg-primary" : "bg-muted"}`} />
          <div className="h-1.5 flex-1 rounded-full bg-muted" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold mb-2">Link your social accounts</h1>
          <p className="text-sm text-muted-foreground">
            Connect at least one account to get started. We'll analyse your audience and match you with relevant campaigns.
          </p>
          {phylloMode === "live" && (
            <p className="text-[10px] text-muted-foreground mt-2 flex items-center justify-center gap-1">
              <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
              Powered by Phyllo — secure OAuth connection
            </p>
          )}
        </div>

        {/* Platform cards */}
        <div className="space-y-3 mb-8">
          {platforms.map((p) => {
            const isLinked = linkedAccounts.includes(p.id);
            const isConnecting = connectingPlatform === p.id;
            return (
              <Card
                key={p.id}
                className={`border transition-all ${
                  isLinked ? "border-primary/30 bg-primary/3" : "border-border/60"
                }`}
                data-testid={`platform-${p.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${p.bgGradient} flex items-center justify-center shrink-0`}>
                      <p.icon className={`h-5 w-5 ${p.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold">{p.name}</h3>
                        {isLinked && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                    </div>
                    <Button
                      variant={isLinked ? "outline" : "default"}
                      size="sm"
                      onClick={() => !isLinked && handleConnect(p)}
                      disabled={isLinked || isConnecting}
                      className="shrink-0"
                      data-testid={`btn-connect-${p.id}`}
                    >
                      {isConnecting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : isLinked ? (
                        "Connected"
                      ) : (
                        "Connect"
                      )}
                    </Button>
                  </div>
                  {isLinked && (
                    <div className="mt-3 pt-3 border-t border-border/40">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Connected via</p>
                      <p className="text-xs text-muted-foreground">
                        {phylloMode === "live" ? "Phyllo Connect — OAuth 2.0" : "Demo Mode — Simulated"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Continue button */}
        <Button
          className="w-full gap-2"
          size="lg"
          disabled={linkedAccounts.length === 0}
          onClick={handleContinue}
          data-testid="btn-continue"
        >
          Continue to Dashboard
          <ArrowRight className="h-4 w-4" />
        </Button>

        {linkedAccounts.length === 0 && (
          <p className="text-xs text-muted-foreground text-center mt-3">
            Connect at least one account to continue
          </p>
        )}
      </div>
    </div>
  );
}
