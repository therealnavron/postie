import { createContext, useContext, useState } from "react";
import type { Platform, SocialAccount } from "./mock-data";
import { connectedAccount } from "./mock-data";

type OnboardingStep = "landing" | "link-accounts" | "loading" | "dashboard";

interface AppState {
  step: OnboardingStep;
  setStep: (s: OnboardingStep) => void;
  linkedAccounts: Platform[];
  linkAccount: (p: Platform) => void;
  unlinkAccount: (p: Platform) => void;
  account: SocialAccount;
  joinedCampaigns: Set<string>;
  joinCampaign: (id: string) => void;
  leaveCampaign: (id: string) => void;
  bioVerified: boolean;
  setBioVerified: (v: boolean) => void;
}

const AppContext = createContext<AppState>({} as AppState);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<OnboardingStep>("landing");
  const [linkedAccounts, setLinkedAccounts] = useState<Platform[]>([]);
  const [joinedCampaigns, setJoinedCampaigns] = useState<Set<string>>(new Set(["c1", "c4"]));
  const [bioVerified, setBioVerified] = useState(false);

  const linkAccount = (p: Platform) => {
    setLinkedAccounts((prev) => (prev.includes(p) ? prev : [...prev, p]));
  };

  const unlinkAccount = (p: Platform) => {
    setLinkedAccounts((prev) => prev.filter((a) => a !== p));
  };

  const joinCampaign = (id: string) => {
    setJoinedCampaigns((prev) => new Set(prev).add(id));
  };

  const leaveCampaign = (id: string) => {
    setJoinedCampaigns((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <AppContext.Provider
      value={{
        step,
        setStep,
        linkedAccounts,
        linkAccount,
        unlinkAccount,
        account: connectedAccount,
        joinedCampaigns,
        joinCampaign,
        leaveCampaign,
        bioVerified,
        setBioVerified,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppState = () => useContext(AppContext);
