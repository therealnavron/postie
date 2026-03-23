import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme";
import { AppStateProvider } from "@/lib/app-state";
import NotFound from "@/pages/not-found";

// Pages
import Landing from "@/pages/landing";
import Onboarding from "@/pages/onboarding";
import DashboardOverview from "@/pages/dashboard";
import Campaigns from "@/pages/campaigns";
import CalendarPage from "@/pages/calendar";
import Earnings from "@/pages/earnings";
import SettingsPage from "@/pages/settings";

// Layouts
import DashboardLayout from "@/components/DashboardLayout";

function DashboardRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <DashboardLayout>
      <Component />
    </DashboardLayout>
  );
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/onboarding" component={Onboarding} />
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppStateProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Router hook={useHashLocation}>
              <AppRouter />
            </Router>
          </TooltipProvider>
        </QueryClientProvider>
      </AppStateProvider>
    </ThemeProvider>
  );
}

export default App;
