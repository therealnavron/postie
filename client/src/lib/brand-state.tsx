import { createContext, useContext, useState } from "react";
import type { BrandAccount, BrandCampaign } from "./mock-data";
import { demoBrandAccount, demoBrandCampaigns } from "./mock-data";

interface BrandState {
  isAuthenticated: boolean;
  brand: BrandAccount | null;
  campaigns: BrandCampaign[];
  login: (email: string, password: string) => boolean;
  signup: (data: SignupData) => boolean;
  logout: () => void;
  addBudget: (campaignId: string, amount: number) => void;
}

export interface SignupData {
  brand_name: string;
  category: string;
  contact_name: string;
  work_email: string;
  password: string;
  referral_code: string;
}

const BrandContext = createContext<BrandState>({} as BrandState);

export function BrandStateProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [brand, setBrand] = useState<BrandAccount | null>(null);
  const [campaigns, setCampaigns] = useState<BrandCampaign[]>(demoBrandCampaigns);

  const login = (_email: string, _password: string): boolean => {
    // Demo mode: always succeed
    setIsAuthenticated(true);
    setBrand(demoBrandAccount);
    return true;
  };

  const signup = (data: SignupData): boolean => {
    // Demo mode: create brand from form data
    const initials = data.brand_name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const newBrand: BrandAccount = {
      id: "b_new",
      brand_name: data.brand_name,
      brand_initials: initials,
      brand_color: "#6C3CE1",
      category: data.category as BrandAccount["category"],
      contact_name: data.contact_name,
      work_email: data.work_email,
      balance: 0,
    };
    setIsAuthenticated(true);
    setBrand(newBrand);
    setCampaigns([]);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setBrand(null);
    setCampaigns(demoBrandCampaigns);
  };

  const addBudget = (campaignId: string, amount: number) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaignId ? { ...c, budget: c.budget + amount } : c,
      ),
    );
    if (brand) {
      setBrand({ ...brand, balance: brand.balance - amount });
    }
  };

  return (
    <BrandContext.Provider
      value={{ isAuthenticated, brand, campaigns, login, signup, logout, addBudget }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export const useBrandState = () => useContext(BrandContext);
