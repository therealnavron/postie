import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAppState } from "@/lib/app-state";
import { connectedAccount } from "@/lib/mock-data";
import type { Platform } from "@/lib/mock-data";
import {
  Shield,
  CheckCircle2,
  XCircle,
  Loader2,
  Link2,
  User,
  Bell,
  Plus,
  Unlink,
} from "lucide-react";
import { SiInstagram, SiTiktok, SiX } from "react-icons/si";

const platformConfig: {
  id: Platform;
  name: string;
  icon: typeof SiInstagram;
  color: string;
  gradient: string;
}[] = [
  { id: "instagram", name: "Instagram", icon: SiInstagram, color: "text-pink-500", gradient: "from-purple-500 to-pink-500" },
  { id: "tiktok", name: "TikTok", icon: SiTiktok, color: "text-foreground", gradient: "from-gray-700 to-gray-500" },
  { id: "twitter", name: "X (Twitter)", icon: SiX, color: "text-foreground", gradient: "from-gray-800 to-gray-600" },
];

export default function SettingsPage() {
  const { linkedAccounts, linkAccount, unlinkAccount, bioVerified, setBioVerified } = useAppState();
  const [checking, setChecking] = useState(false);
  const [connectingPlatform, setConnectingPlatform] = useState<Platform | null>(null);

  const handleBioCheck = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setBioVerified(true);
    }, 2000);
  };

  const handleConnect = (id: Platform) => {
    setConnectingPlatform(id);
    setTimeout(() => {
      linkAccount(id);
      setConnectingPlatform(null);
    }, 1500);
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6" data-testid="settings-page">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your connected accounts and preferences.
        </p>
      </div>

      {/* Connected accounts */}
      <Card className="border border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Connected Accounts</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Manage your linked social media accounts. Connect more to unlock additional campaigns.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {platformConfig.map((p) => {
            const isLinked = linkedAccounts.includes(p.id);
            const isConnecting = connectingPlatform === p.id;
            return (
              <div
                key={p.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  isLinked ? "bg-card border-border/60" : "border-dashed border-border/40"
                }`}
                data-testid={`settings-platform-${p.id}`}
              >
                <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${p.gradient} flex items-center justify-center text-white shrink-0`}>
                  <p.icon className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{p.name}</p>
                    {isLinked && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                  </div>
                  {isLinked ? (
                    <p className="text-xs text-muted-foreground">
                      @{connectedAccount.username} · {connectedAccount.followers.toLocaleString()} followers
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Not connected</p>
                  )}
                </div>
                {isLinked ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs gap-1 text-muted-foreground hover:text-destructive"
                    onClick={() => unlinkAccount(p.id)}
                    data-testid={`btn-unlink-${p.id}`}
                  >
                    <Unlink className="h-3 w-3" />
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1"
                    onClick={() => handleConnect(p.id)}
                    disabled={isConnecting}
                    data-testid={`btn-link-${p.id}`}
                  >
                    {isConnecting ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Plus className="h-3 w-3" />
                    )}
                    {isConnecting ? "Connecting..." : "Connect"}
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Bio Bonus Verification */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/3 to-primary/6" data-testid="card-bio-bonus">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Bio Bonus — Earn 5% More</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Add <span className="font-medium text-foreground">postie@postie.app</span> to your social bio to get a 5% CPM boost on every campaign.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {/* Steps */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-semibold text-primary">1</span>
              </div>
              <div>
                <p className="text-sm font-medium">Add our email to your bio</p>
                <p className="text-xs text-muted-foreground">
                  Open your social profile, go to Edit Profile, and add{" "}
                  <span className="font-mono text-primary bg-primary/8 px-1 py-0.5 rounded text-[11px]">
                    postie@postie.app
                  </span>{" "}
                  anywhere in your bio.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-semibold text-primary">2</span>
              </div>
              <div>
                <p className="text-sm font-medium">Click verify below</p>
                <p className="text-xs text-muted-foreground">
                  We'll check your bio instantly. Once confirmed, the 5% bonus applies to all future earnings.
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status & verify button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {bioVerified ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Bio verified</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Not verified</span>
                </>
              )}
            </div>
            <Button
              onClick={handleBioCheck}
              disabled={checking || bioVerified}
              size="sm"
              className="gap-1.5"
              data-testid="btn-verify-bio"
            >
              {checking ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Checking...
                </>
              ) : bioVerified ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified
                </>
              ) : (
                <>
                  <Shield className="h-3.5 w-3.5" />
                  Check to Verify
                </>
              )}
            </Button>
          </div>

          {bioVerified && (
            <div className="p-3 rounded-lg bg-emerald-500/8 border border-emerald-500/15 text-xs text-emerald-700 dark:text-emerald-300">
              Your bio bonus is active. You're earning 5% more CPM on all campaigns.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile info */}
      <Card className="border border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold">Profile</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-card border border-border/40">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">Name</p>
              <p className="text-sm font-medium">{connectedAccount.display_name}</p>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border/40">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">Email</p>
              <p className="text-sm font-medium">demo@postie.app</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold">Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {[
            { label: "New campaign matches", desc: "Get notified when new campaigns match your audience", defaultOn: true },
            { label: "Earnings updates", desc: "Weekly earnings summary emails", defaultOn: true },
            { label: "Payout notifications", desc: "Get notified when payouts are processed", defaultOn: true },
            { label: "Campaign reminders", desc: "Reminders for upcoming post deadlines", defaultOn: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch defaultChecked={item.defaultOn} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
