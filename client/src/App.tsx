import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme";
import { AppStateProvider } from "@/lib/app-state";
import { BrandStateProvider } from "@/lib/brand-state";
import NotFound from "@/pages/not-found";

// Creator pages
import Landing from "@/pages/landing";
import Onboarding from "@/pages/onboarding";
import DashboardOverview from "@/pages/dashboard";
import Campaigns from "@/pages/campaigns";
import CalendarPage from "@/pages/calendar";
import Earnings from "@/pages/earnings";
import SettingsPage from "@/pages/settings";

// Brand pages
import { BrandLogin, BrandSignup } from "@/pages/brand-auth";
import BrandDashboard from "@/pages/brand-dashboard";
import BrandCampaignDetail from "@/pages/brand-campaign-detail";
import BrandCampaignBuilder from "@/pages/brand-campaign-builder";
import BrandContent from "@/pages/brand-content";
import BrandContentDetail from "@/pages/brand-content-detail";
import BrandSentiment from "@/pages/brand-sentiment";

// Layouts
import DashboardLayout from "@/components/DashboardLayout";
import BrandLayout from "@/components/BrandLayout";

function DashboardRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <DashboardLayout>
      <Component />
    </DashboardLayout>
  );
}

function BrandRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <BrandLayout>
      <Component />
    </BrandLayout>
  );
}

function AppRouter() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={Landing} />
      <Route path="/onboarding" component={Onboarding} />

      {/* Creator dashboard */}
      <Route path="/dashboard">
        <DashboardRoute component={DashboardOverview} />
      </Route>
      <Route path="/dashboard/campaigns">
        <DashboardRoute component={Campaigns} />
      </Route>
      <Route path="/dashboard/calendar">
        <DashboardRoute component={CalendarPage} />
      </Route>
      <Route path="/dashboard/earnings">
        <DashboardRoute component={Earnings} />
      </Route>
      <Route path="/dashboard/settings">
        <DashboardRoute component={SettingsPage} />
      </Route>

      {/* Brand auth (no layout) */}
      <Route path="/brand/login" component={BrandLogin} />
      <Route path="/brand/signup" component={BrandSignup} />

      {/* Brand dashboard */}
      <Route path="/brand/dashboard">
        <BrandRoute component={BrandDashboard} />
      </Route>
      <Route path="/brand/campaigns/new">
        <BrandRoute component={BrandCampaignBuilder} />
      </Route>
      <Route path="/brand/campaigns/:id/content">
        <BrandRoute component={BrandContent} />
      </Route>
      <Route path="/brand/campaigns/:id/sentiment">
        <BrandRoute component={BrandSentiment} />
      </Route>
      <Route path="/brand/content/:id">
        <BrandRoute component={BrandContentDetail} />
      </Route>
      <Route path="/brand/campaigns/:id">
        <BrandRoute component={BrandCampaignDetail} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppStateProvider>
        <BrandStateProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Router hook={useHashLocation}>
                <AppRouter />
              </Router>
            </TooltipProvider>
          </QueryClientProvider>
        </BrandStateProvider>
      </AppStateProvider>
    </ThemeProvider>
  );
}

export default App;
