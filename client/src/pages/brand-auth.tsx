import { useState } from "react";
import { Link, useLocation } from "wouter";
import { PostieLogoFull } from "@/components/PostieLogo";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/lib/theme";
import { useBrandState } from "@/lib/brand-state";
import { brandCategories } from "@/lib/mock-data";
import {
  ArrowRight,
  Sun,
  Moon,
  Building2,
  Lock,
  Mail,
  User,
  Tag,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

export function BrandLogin() {
  const { theme, toggle } = useTheme();
  const { login } = useBrandState();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("sarah@cloudvpn.io");
  const [password, setPassword] = useState("demo1234");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    setTimeout(() => {
      login(email, password);
      setLoading(false);
      setLocation("/brand/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="brand-login-page">
      {/* Nav */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/">
            <PostieLogoFull />
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} className="h-8 w-8" data-testid="brand-theme-toggle">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-semibold">Brand Login</h1>
            <p className="text-sm text-muted-foreground">Sign in to manage your campaigns</p>
            <Badge variant="secondary" className="text-[10px]">Demo Mode</Badge>
          </div>

          <Card className="border border-border/60">
            <CardContent className="p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs">Work Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      placeholder="you@company.com"
                      data-testid="brand-login-email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      placeholder="••••••••"
                      data-testid="brand-login-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && <p className="text-xs text-destructive">{error}</p>}

                <Button type="submit" className="w-full gap-2" disabled={loading} data-testid="brand-login-submit">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/brand/signup" className="text-primary font-medium hover:underline" data-testid="brand-signup-link">
                    Create one
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              ← Back to home
            </Link>
            <PerplexityAttribution />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BrandSignup() {
  const { theme, toggle } = useTheme();
  const { signup } = useBrandState();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [form, setForm] = useState({
    brand_name: "",
    category: "",
    contact_name: "",
    work_email: "",
    password: "",
    referral_code: "",
  });

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.brand_name || !form.category || !form.contact_name || !form.work_email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => {
      signup(form);
      setLoading(false);
      setLocation("/brand/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="brand-signup-page">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/">
            <PostieLogoFull />
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} className="h-8 w-8">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-semibold">Create Brand Account</h1>
            <p className="text-sm text-muted-foreground">Set up your brand to start running campaigns</p>
            <Badge variant="secondary" className="text-[10px]">Demo Mode</Badge>
          </div>

          <Card className="border border-border/60">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Brand Name */}
                <div className="space-y-2">
                  <Label htmlFor="brand_name" className="text-xs">Brand Name *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="brand_name"
                      value={form.brand_name}
                      onChange={(e) => update("brand_name", e.target.value)}
                      className="pl-10"
                      placeholder="Acme Inc."
                      data-testid="brand-signup-name"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label className="text-xs">Brand Category *</Label>
                  <Select value={form.category} onValueChange={(v) => update("category", v)}>
                    <SelectTrigger data-testid="brand-signup-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {brandCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Contact Name */}
                <div className="space-y-2">
                  <Label htmlFor="contact_name" className="text-xs">Your Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contact_name"
                      value={form.contact_name}
                      onChange={(e) => update("contact_name", e.target.value)}
                      className="pl-10"
                      placeholder="Jane Doe"
                      data-testid="brand-signup-contact"
                    />
                  </div>
                </div>

                {/* Work Email */}
                <div className="space-y-2">
                  <Label htmlFor="work_email" className="text-xs">Work Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="work_email"
                      type="email"
                      value={form.work_email}
                      onChange={(e) => update("work_email", e.target.value)}
                      className="pl-10"
                      placeholder="jane@acme.com"
                      data-testid="brand-signup-email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPw ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                      className="pl-10 pr-10"
                      placeholder="Min 8 characters"
                      data-testid="brand-signup-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Referral Code */}
                <div className="space-y-2">
                  <Label htmlFor="referral" className="text-xs">Referral Code <span className="text-muted-foreground">(optional)</span></Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="referral"
                      value={form.referral_code}
                      onChange={(e) => update("referral_code", e.target.value)}
                      className="pl-10"
                      placeholder="POSTIE2026"
                      data-testid="brand-signup-referral"
                    />
                  </div>
                </div>

                {error && <p className="text-xs text-destructive">{error}</p>}

                <Button type="submit" className="w-full gap-2" disabled={loading} data-testid="brand-signup-submit">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  {loading ? "Creating..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/brand/login" className="text-primary font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              ← Back to home
            </Link>
            <PerplexityAttribution />
          </div>
        </div>
      </div>
    </div>
  );
}
