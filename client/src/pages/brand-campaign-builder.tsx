import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBrandState } from "@/lib/brand-state";
import { brandGrowthTiers } from "@/lib/mock-data";
import type { PostType, CampaignStyle } from "@/lib/mock-data";
import {
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Film,
  Image as ImageIcon,
  Layers,
  MessageSquare,
  Monitor,
  Calendar,
  Wallet,
  Loader2,
  CheckCircle2,
  Phone,
  Upload,
  Eye,
  Zap,
  DollarSign,
} from "lucide-react";

type BuilderStep = "style" | "content" | "budget" | "schedule" | "review";

const steps: { key: BuilderStep; label: string }[] = [
  { key: "style", label: "Style" },
  { key: "content", label: "Content" },
  { key: "budget", label: "Budget" },
  { key: "schedule", label: "Schedule" },
  { key: "review", label: "Review" },
];

const contentTypes: { value: PostType; label: string; icon: typeof Film; desc: string }[] = [
  { value: "reel", label: "Reel", icon: Film, desc: "Short-form video for Reels/TikTok" },
  { value: "video", label: "Video Post", icon: Monitor, desc: "Feed video post" },
  { value: "slideshow", label: "Carousel", icon: Layers, desc: "Multi-image slideshow post" },
  { value: "single_image", label: "Single Image", icon: ImageIcon, desc: "One photo, feed post" },
  { value: "story", label: "Story", icon: Sparkles, desc: "24-hour disappearing story" },
  { value: "thread", label: "Thread", icon: MessageSquare, desc: "Multi-post thread on X" },
];

export default function BrandCampaignBuilder() {
  const [, setLocation] = useLocation();
  const { brand } = useBrandState();
  const [step, setStep] = useState<BuilderStep>("style");
  const [launching, setLaunching] = useState(false);

  // Form state
  const [style, setStyle] = useState<CampaignStyle | "">("");
  const [contentType, setContentType] = useState<PostType | "">("");
  const [budget, setBudget] = useState("");
  const [goLiveDate, setGoLiveDate] = useState("");
  const [campaignTitle, setCampaignTitle] = useState("");
  const [useBalance, setUseBalance] = useState(true);

  const currentStepIndex = steps.findIndex((s) => s.key === step);
  const budgetNum = parseFloat(budget) || 0;

  // Calculate CPM based on budget tier
  const getCPM = (): number => {
    if (style === "viral_content") return 0;
    for (const tier of brandGrowthTiers) {
      if (budgetNum >= tier.min_budget && budgetNum <= tier.max_budget) return tier.cpm;
    }
    if (budgetNum > 0 && budgetNum < 50000) return 0.60;
    return 0.60;
  };

  const cpm = getCPM();
  const estimatedViews = cpm > 0 ? Math.round(budgetNum / cpm * 1000) : 0;

  const balanceAvailable = brand?.balance || 0;
  const depositNeeded = useBalance ? Math.max(0, budgetNum - balanceAvailable) : budgetNum;

  const canProceed = (): boolean => {
    switch (step) {
      case "style": return style !== "";
      case "content": return style === "viral_content" || contentType !== "";
      case "budget": return style === "viral_content" || (budgetNum >= 50000 && campaignTitle !== "");
      case "schedule": return style === "viral_content" || goLiveDate !== "";
      case "review": return true;
      default: return false;
    }
  };

  const nextStep = () => {
    const idx = currentStepIndex;
    // For viral content, skip budget and schedule, go straight to review
    if (style === "viral_content" && step === "content") {
      setStep("review");
      return;
    }
    if (idx < steps.length - 1) setStep(steps[idx + 1].key);
  };

  const prevStep = () => {
    const idx = currentStepIndex;
    if (style === "viral_content" && step === "review") {
      setStep("content");
      return;
    }
    if (idx > 0) setStep(steps[idx - 1].key);
  };

  const handleLaunch = () => {
    setLaunching(true);
    setTimeout(() => {
      setLaunching(false);
      setLocation("/brand/dashboard");
    }, 1200);
  };

  // Get current tier label
  const getTierLabel = (): string => {
    for (const tier of brandGrowthTiers) {
      if (budgetNum >= tier.min_budget && budgetNum <= tier.max_budget) return tier.label;
    }
    return "";
  };

  return (
    <div className="p-4 sm:p-6 max-w-[800px] mx-auto space-y-6" data-testid="brand-campaign-builder">
      {/* Back */}
      <Link href="/brand/dashboard">
        <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to campaigns
        </Button>
      </Link>

      <div>
        <h1 className="text-xl font-semibold">New Campaign</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Set up your campaign in a few steps</p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-1">
        {steps.map((s, i) => {
          // Hide budget/schedule for viral content
          if (style === "viral_content" && (s.key === "budget" || s.key === "schedule")) return null;
          const isActive = s.key === step;
          const isPast = currentStepIndex > i;
          return (
            <div key={s.key} className="flex items-center gap-1 flex-1">
              <div className={`h-1.5 flex-1 rounded-full transition-colors ${
                isActive ? "bg-primary" : isPast ? "bg-primary/40" : "bg-muted"
              }`} />
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-muted-foreground">
        Step {currentStepIndex + 1}: {steps[currentStepIndex].label}
      </p>

      {/* ── STEP: Style ── */}
      {step === "style" && (
        <div className="space-y-4" data-testid="step-style">
          <h2 className="text-sm font-semibold">Choose your campaign style</h2>

          <div className="grid sm:grid-cols-2 gap-3">
            {/* Brand Growth */}
            <Card
              className={`border cursor-pointer transition-all ${
                style === "brand_growth"
                  ? "border-primary ring-1 ring-primary/20"
                  : "border-border/60 hover:border-border"
              }`}
              onClick={() => setStyle("brand_growth")}
              data-testid="style-brand-growth"
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Brand Growth</h3>
                    <Badge variant="secondary" className="text-[9px]">Most Popular</Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  We distribute your content across thousands of creator accounts. You set the budget, pick content type, and we handle the rest.
                </p>
                <div className="space-y-1 text-[11px] text-muted-foreground">
                  <p>• CPMs from £0.20 – £0.60 based on budget</p>
                  <p>• Select content type (reels, images, stories…)</p>
                  <p>• Logo overlay on videos</p>
                  <p>• Estimated views before you commit</p>
                  <p>• Starting from £50,000 budget</p>
                </div>
              </CardContent>
            </Card>

            {/* Viral Content */}
            <Card
              className={`border cursor-pointer transition-all ${
                style === "viral_content"
                  ? "border-primary ring-1 ring-primary/20"
                  : "border-border/60 hover:border-border"
              }`}
              onClick={() => setStyle("viral_content")}
              data-testid="style-viral-content"
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Viral Content</h3>
                    <Badge variant="secondary" className="text-[9px]">Custom</Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  Got a specific video or creative you want to go viral? Upload it or schedule a call with our team to plan a bespoke strategy.
                </p>
                <div className="space-y-1 text-[11px] text-muted-foreground">
                  <p>• Upload your own video</p>
                  <p>• Or schedule a strategy call</p>
                  <p>• Custom pricing & targeting</p>
                  <p>• Dedicated campaign manager</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ── STEP: Content ── */}
      {step === "content" && (
        <div className="space-y-4" data-testid="step-content">
          {style === "brand_growth" ? (
            <>
              <h2 className="text-sm font-semibold">Choose content type</h2>
              <p className="text-xs text-muted-foreground">What kind of posts should creators make for your campaign?</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {contentTypes.map((ct) => (
                  <Card
                    key={ct.value}
                    className={`border cursor-pointer transition-all ${
                      contentType === ct.value
                        ? "border-primary ring-1 ring-primary/20"
                        : "border-border/60 hover:border-border"
                    }`}
                    onClick={() => setContentType(ct.value)}
                    data-testid={`content-${ct.value}`}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <ct.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{ct.label}</p>
                        <p className="text-[11px] text-muted-foreground">{ct.desc}</p>
                      </div>
                      {contentType === ct.value && (
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 ml-auto" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-sm font-semibold">Viral Content</h2>
              <p className="text-xs text-muted-foreground mb-4">Upload your video or schedule a call with our team</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <Card className="border border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors" data-testid="viral-upload">
                  <CardContent className="p-6 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium mb-1">Upload Video</p>
                    <p className="text-[11px] text-muted-foreground">MP4, MOV up to 500MB</p>
                    <Badge variant="secondary" className="mt-3 text-[10px]">Demo — coming soon</Badge>
                  </CardContent>
                </Card>
                <Card className="border border-border/60 hover:border-border cursor-pointer transition-colors" data-testid="viral-call">
                  <CardContent className="p-6 text-center">
                    <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
                    <p className="text-sm font-medium mb-1">Schedule a Call</p>
                    <p className="text-[11px] text-muted-foreground">Talk to our team about your strategy</p>
                    <Badge variant="secondary" className="mt-3 text-[10px]">Demo — coming soon</Badge>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── STEP: Budget ── */}
      {step === "budget" && style === "brand_growth" && (
        <div className="space-y-4" data-testid="step-budget">
          <h2 className="text-sm font-semibold">Set your budget</h2>

          {/* Campaign title */}
          <div className="space-y-2">
            <Label className="text-xs">Campaign Name</Label>
            <Input
              value={campaignTitle}
              onChange={(e) => setCampaignTitle(e.target.value)}
              placeholder="e.g. Spring Launch 2026"
              data-testid="campaign-title-input"
            />
          </div>

          {/* Budget tiers */}
          <div className="space-y-2">
            <Label className="text-xs">Budget (minimum £50,000)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">£</span>
              <Input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="pl-7 text-lg font-semibold"
                placeholder="50,000"
                min={50000}
                step={10000}
                data-testid="budget-input"
              />
            </div>
          </div>

          {/* Tier cards */}
          <div className="space-y-2">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">CPM Tiers</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {brandGrowthTiers.map((tier) => {
                const isActive = budgetNum >= tier.min_budget && budgetNum <= tier.max_budget;
                return (
                  <div
                    key={tier.label}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      isActive
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border/60 hover:border-border"
                    }`}
                    onClick={() => setBudget(tier.min_budget.toString())}
                  >
                    <p className={`text-sm font-semibold ${isActive ? "text-primary" : ""}`}>£{tier.cpm.toFixed(2)}</p>
                    <p className="text-[10px] text-muted-foreground">CPM</p>
                    <p className="text-[9px] text-muted-foreground mt-1">{tier.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Estimated views */}
          {budgetNum >= 50000 && (
            <Card className="border border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">~{estimatedViews.toLocaleString()} estimated views</p>
                    <p className="text-[11px] text-muted-foreground">
                      {getTierLabel()} tier · £{cpm.toFixed(2)} CPM · {contentType ? contentTypes.find((c) => c.value === contentType)?.label : "TBC"} content
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {budgetNum > 0 && budgetNum < 50000 && (
            <p className="text-xs text-destructive">Minimum budget for Brand Growth is £50,000</p>
          )}
        </div>
      )}

      {/* ── STEP: Schedule ── */}
      {step === "schedule" && style === "brand_growth" && (
        <div className="space-y-4" data-testid="step-schedule">
          <h2 className="text-sm font-semibold">Set go-live date</h2>
          <p className="text-xs text-muted-foreground">When should the campaign start running?</p>

          <div className="space-y-2">
            <Label className="text-xs">Go-Live Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={goLiveDate}
                onChange={(e) => setGoLiveDate(e.target.value)}
                className="pl-10"
                data-testid="golive-date-input"
              />
            </div>
          </div>

          {/* Payment method */}
          <div className="space-y-3 pt-4 border-t border-border/50">
            <h3 className="text-sm font-semibold">Payment</h3>
            <div className="space-y-2">
              {balanceAvailable > 0 && (
                <Card
                  className={`border cursor-pointer transition-all ${
                    useBalance ? "border-primary ring-1 ring-primary/20" : "border-border/60"
                  }`}
                  onClick={() => setUseBalance(true)}
                  data-testid="pay-balance"
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Use account balance</p>
                      <p className="text-[11px] text-muted-foreground">
                        £{balanceAvailable.toLocaleString("en-GB", { minimumFractionDigits: 2 })} available
                        {budgetNum > balanceAvailable && ` · £${(budgetNum - balanceAvailable).toLocaleString()} deposit needed`}
                      </p>
                    </div>
                    {useBalance && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </CardContent>
                </Card>
              )}
              <Card
                className={`border cursor-pointer transition-all ${
                  !useBalance ? "border-primary ring-1 ring-primary/20" : "border-border/60"
                }`}
                onClick={() => setUseBalance(false)}
                data-testid="pay-deposit"
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Full deposit</p>
                    <p className="text-[11px] text-muted-foreground">Pay £{budgetNum.toLocaleString()} upfront</p>
                  </div>
                  {!useBalance && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </CardContent>
              </Card>
            </div>

            {depositNeeded > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/15">
                <DollarSign className="h-4 w-4 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Deposit of <span className="font-semibold">£{depositNeeded.toLocaleString()}</span> required
                  {useBalance && balanceAvailable > 0 && ` (£${balanceAvailable.toLocaleString()} from balance + £${(budgetNum - balanceAvailable).toLocaleString()} deposit)`}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STEP: Review ── */}
      {step === "review" && (
        <div className="space-y-4" data-testid="step-review">
          <h2 className="text-sm font-semibold">Review & Launch</h2>

          <Card className="border border-border/60">
            <CardContent className="p-5 space-y-4">
              {style === "brand_growth" ? (
                <>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Campaign</p>
                      <p className="font-medium">{campaignTitle || "Untitled"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Style</p>
                      <p className="font-medium">Brand Growth</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Content Type</p>
                      <p className="font-medium">{contentTypes.find((c) => c.value === contentType)?.label || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Budget</p>
                      <p className="font-medium">£{budgetNum.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">CPM</p>
                      <p className="font-medium">£{cpm.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Est. Views</p>
                      <p className="font-medium">~{estimatedViews.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Go-Live</p>
                      <p className="font-medium">{goLiveDate ? new Date(goLiveDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "—"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Payment</p>
                      <p className="font-medium">{useBalance && balanceAvailable > 0 ? "Balance + Deposit" : "Full Deposit"}</p>
                    </div>
                  </div>

                  {depositNeeded > 0 && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/15">
                      <Wallet className="h-4 w-4 text-primary shrink-0" />
                      <p className="text-xs">
                        <span className="font-semibold">£{depositNeeded.toLocaleString()}</span> will be charged upon launch
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <Sparkles className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                  <h3 className="text-sm font-semibold mb-1">Viral Content Request</h3>
                  <p className="text-xs text-muted-foreground">
                    Our team will be in touch to discuss your bespoke campaign strategy.
                  </p>
                  <Badge variant="secondary" className="mt-3 text-[10px]">Demo Mode</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={currentStepIndex === 0}
          className="gap-1.5"
          data-testid="builder-prev"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Button>

        {step === "review" ? (
          <Button
            onClick={handleLaunch}
            disabled={launching}
            className="gap-1.5"
            data-testid="builder-launch"
          >
            {launching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            {launching ? "Launching..." : style === "viral_content" ? "Submit Request" : "Launch Campaign"}
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="gap-1.5"
            data-testid="builder-next"
          >
            Next
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
