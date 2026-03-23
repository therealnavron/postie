import { useState } from "react";
import { Link, useLocation } from "wouter";
import { PostieLogoFull } from "@/components/PostieLogo";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/lib/theme";
import { useAppState } from "@/lib/app-state";
import { connectedAccount, activeCampaigns } from "@/lib/mock-data";
import {
  LayoutDashboard,
  Megaphone,
  Search,
  Calendar,
  DollarSign,
  Settings,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  Shield,
  ChevronRight,
  Eye,
  Clock,
} from "lucide-react";
import { SiInstagram, SiTiktok, SiX as SiXIcon } from "react-icons/si";

const platformIcons: Record<string, typeof SiInstagram> = { instagram: SiInstagram, tiktok: SiTiktok, twitter: SiXIcon };

const mainNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/campaigns", label: "Discover Campaigns", icon: Search },
  { href: "/dashboard/calendar", label: "Content Calendar", icon: Calendar },
  { href: "/dashboard/earnings", label: "Earnings", icon: DollarSign },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, toggle } = useTheme();
  const { bioVerified, joinedCampaigns } = useAppState();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return location === "/dashboard";
    return location.startsWith(href);
  };

  // Active campaigns count
  const activeCount = activeCampaigns.length + joinedCampaigns.size;

  return (
    <div className="min-h-screen bg-background flex" data-testid="dashboard-layout">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[252px] shrink-0 flex-col border-r border-border bg-sidebar">
        <div className="p-4 border-b border-sidebar-border">
          <Link href="/">
            <PostieLogoFull />
          </Link>
        </div>

        {/* Bio bonus banner */}
        {!bioVerified && (
          <div className="mx-3 mt-3 p-3 rounded-lg bg-primary/8 border border-primary/15">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">Earn 5% more</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug mb-2">
              Add postie@postie.app to your bio
            </p>
            <Link href="/dashboard/settings">
              <Button variant="outline" size="sm" className="h-7 text-xs w-full gap-1">
                Verify bio <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        )}

        {/* Main navigation */}
        <nav className="flex-1 p-3 space-y-0.5">
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href}>
              <button
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive(item.href)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                }`}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.label === "Discover Campaigns" && (
                  <Badge variant="secondary" className="ml-auto text-[9px] h-4 px-1.5">New</Badge>
                )}
              </button>
            </Link>
          ))}

          <Separator className="my-3" />

          {/* Active campaigns section */}
          <div className="px-3 mb-2">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Active Campaigns
            </p>
          </div>
          {activeCampaigns.map((c) => {
            const PIcon = platformIcons[c.posting_to.platform];
            return (
              <div
                key={c.id}
                className="px-3 py-2 rounded-md hover:bg-sidebar-accent/50 transition-colors cursor-default"
                data-testid={`sidebar-campaign-${c.id}`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-6 rounded flex items-center justify-center shrink-0 text-white text-[8px] font-bold"
                    style={{ backgroundColor: c.brand_color }}
                  >
                    {c.brand_logo_initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate">{c.brand_name}</p>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <PIcon className="h-2.5 w-2.5" />
                      <span>{c.post_type}</span>
                      {(c.user_status === "posted" || c.user_status === "auto_posted") && c.views && (
                        <>
                          <span>·</span>
                          <Eye className="h-2.5 w-2.5" />
                          <span>{(c.views / 1000).toFixed(1)}k</span>
                        </>
                      )}
                      {c.user_status === "scheduled" && (
                        <>
                          <span>·</span>
                          <Clock className="h-2.5 w-2.5" />
                          <span>Scheduled</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {activeCount === 0 && (
            <p className="px-3 text-[11px] text-muted-foreground">No active campaigns</p>
          )}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-sidebar-border space-y-2">
          <div className="flex items-center gap-2 px-3 py-1.5">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-white">AD</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate">{connectedAccount.display_name}</p>
              <p className="text-[10px] text-muted-foreground truncate">@{connectedAccount.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-1">
            <Button variant="ghost" size="icon" onClick={toggle} className="h-7 w-7" data-testid="sidebar-theme-toggle">
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </Button>
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-7 w-7" data-testid="sidebar-logout">
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="px-1 pt-1">
            <PerplexityAttribution />
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="md:hidden sticky top-0 z-50 h-14 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4">
          <Link href="/">
            <PostieLogoFull />
          </Link>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={toggle} className="h-8 w-8" data-testid="mobile-theme-toggle">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="h-8 w-8"
              data-testid="mobile-menu-toggle"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        {/* Mobile nav overlay */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 top-14 z-40 bg-background border-t border-border overflow-auto">
            <nav className="p-4 space-y-1">
              {!bioVerified && (
                <div className="p-3 rounded-lg bg-primary/8 border border-primary/15 mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium">Earn 5% more — add postie@postie.app to your bio</span>
                  </div>
                </div>
              )}
              {mainNav.map((item) => (
                <Link key={item.href} href={item.href}>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                      isActive(item.href)
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                    data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    {item.label === "Discover Campaigns" && (
                      <Badge variant="secondary" className="ml-auto text-[10px] h-5">New</Badge>
                    )}
                  </button>
                </Link>
              ))}

              {/* Active campaigns in mobile */}
              <Separator className="my-3" />
              <p className="px-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Active Campaigns
              </p>
              {activeCampaigns.map((c) => {
                const PIcon = platformIcons[c.posting_to.platform];
                return (
                  <div key={c.id} className="px-4 py-2 flex items-center gap-2">
                    <div
                      className="h-7 w-7 rounded flex items-center justify-center shrink-0 text-white text-[9px] font-bold"
                      style={{ backgroundColor: c.brand_color }}
                    >
                      {c.brand_logo_initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate">{c.brand_name}</p>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <PIcon className="h-2.5 w-2.5" />
                        <span>{c.post_type}</span>
                        <span>·</span>
                        <span className="capitalize">{c.user_status === "auto_posted" ? "Posted" : c.user_status}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <Separator className="my-3" />
              <Link href="/">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </Link>
            </nav>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
