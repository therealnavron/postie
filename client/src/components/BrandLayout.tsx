import { useState } from "react";
import { Link, useLocation } from "wouter";
import { PostieLogoFull } from "@/components/PostieLogo";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/lib/theme";
import { useBrandState } from "@/lib/brand-state";
import {
  LayoutDashboard,
  PlusCircle,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  Wallet,
  Building2,
} from "lucide-react";

const brandNav = [
  { href: "/brand/dashboard", label: "Campaigns", icon: LayoutDashboard },
  { href: "/brand/campaigns/new", label: "New Campaign", icon: PlusCircle },
];

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, toggle } = useTheme();
  const { brand, logout, campaigns } = useBrandState();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/brand/dashboard") return location === "/brand/dashboard" || location.startsWith("/brand/campaigns/") && !location.endsWith("/new");
    return location.startsWith(href);
  };

  const handleLogout = () => {
    logout();
  };

  const activeCampaignsCount = campaigns.filter((c) => c.status === "active").length;

  return (
    <div className="min-h-screen bg-background flex" data-testid="brand-layout">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[252px] shrink-0 flex-col border-r border-border bg-sidebar">
        <div className="p-4 border-b border-sidebar-border">
          <Link href="/">
            <PostieLogoFull />
          </Link>
        </div>

        {/* Brand info card */}
        {brand && (
          <div className="mx-3 mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: brand.brand_color }}
              >
                {brand.brand_initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate">{brand.brand_name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{brand.contact_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <Wallet className="h-3 w-3 text-primary" />
              <span className="font-medium">Balance: £{brand.balance.toLocaleString("en-GB", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        )}

        {/* Main navigation */}
        <nav className="flex-1 p-3 space-y-0.5">
          {brandNav.map((item) => (
            <Link key={item.href} href={item.href}>
              <button
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive(item.href)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                }`}
                data-testid={`brand-nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.label === "Campaigns" && activeCampaignsCount > 0 && (
                  <Badge variant="secondary" className="ml-auto text-[9px] h-4 px-1.5">
                    {activeCampaignsCount}
                  </Badge>
                )}
              </button>
            </Link>
          ))}

          <Separator className="my-3" />

          {/* Campaign list */}
          <div className="px-3 mb-2">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Active Campaigns
            </p>
          </div>
          {campaigns
            .filter((c) => c.status === "active")
            .map((c) => (
              <Link key={c.id} href={`/brand/campaigns/${c.id}`}>
                <div
                  className="px-3 py-2 rounded-md hover:bg-sidebar-accent/50 transition-colors cursor-pointer"
                  data-testid={`brand-sidebar-campaign-${c.id}`}
                >
                  <p className="text-xs font-medium truncate">{c.title}</p>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                    <span>{c.total_views.toLocaleString()} views</span>
                    <span>·</span>
                    <span>£{c.spent.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          {campaigns.filter((c) => c.status === "active").length === 0 && (
            <p className="px-3 text-[11px] text-muted-foreground">No active campaigns</p>
          )}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-sidebar-border space-y-2">
          <Badge variant="secondary" className="text-[10px] w-full justify-center py-1">Demo Mode</Badge>
          <div className="flex items-center gap-1 px-1">
            <Button variant="ghost" size="icon" onClick={toggle} className="h-7 w-7">
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </Button>
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleLogout} data-testid="brand-logout">
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
            <Button variant="ghost" size="icon" onClick={toggle} className="h-8 w-8">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="h-8 w-8"
              data-testid="brand-mobile-menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 top-14 z-40 bg-background border-t border-border overflow-auto">
            <nav className="p-4 space-y-1">
              {brand && (
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: brand.brand_color }}
                    >
                      {brand.brand_initials}
                    </div>
                    <div>
                      <p className="text-xs font-semibold">{brand.brand_name}</p>
                      <p className="text-[10px] text-muted-foreground">Balance: £{brand.balance.toLocaleString("en-GB", { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                </div>
              )}
              {brandNav.map((item) => (
                <Link key={item.href} href={item.href}>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                      isActive(item.href)
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                </Link>
              ))}
              <Separator className="my-3" />
              <Link href="/">
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </Link>
            </nav>
          </div>
        )}

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
