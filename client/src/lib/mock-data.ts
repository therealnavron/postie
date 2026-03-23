// ── Types ────────────────────────────────────────────────────

export type Platform = "instagram" | "tiktok" | "twitter";

export interface SocialAccount {
  platform: Platform;
  username: string;
  display_name: string;
  avatar_url: string;
  followers: number;
  following: number;
  posts_count: number;
  engagement_rate: number;
  account_type: string;
  bio: string;
  verified: boolean;
  demographics: Demographics;
}

export interface Demographics {
  age_groups: { label: string; pct: number }[];
  gender: { label: string; pct: number }[];
  top_countries: { code: string; name: string; pct: number }[];
  top_cities: { name: string; pct: number }[];
}

export interface Campaign {
  id: string;
  brand_name: string;
  brand_logo_initials: string;
  brand_color: string;
  title: string;
  description: string;
  content_type: "image" | "video" | "reel" | "carousel" | "story" | "thread";
  platform: Platform;
  caption: string;
  cpm_rate: number;
  bio_bonus_cpm_rate: number;
  start_date: string;
  end_date: string;
  status: "open" | "active" | "upcoming" | "completed";
  category: string;
  min_followers: number;
  spots_total: number;
  spots_filled: number;
  match_score?: number;
}

export interface ActiveCampaign extends Campaign {
  user_status: "joined" | "posted" | "scheduled";
  scheduled_date?: string;
  views?: number;
  earned?: number;
}

export interface CalendarEvent {
  id: string;
  date: string;
  campaign_title: string;
  brand_name: string;
  content_type: string;
  platform: Platform;
  status: "scheduled" | "posted" | "due_today" | "overdue";
  time?: string;
}

export interface Earning {
  id: string;
  campaign_id: string;
  brand_name: string;
  platform: Platform;
  views: number;
  cpm_rate: number;
  amount: number;
  bio_bonus_applied: boolean;
  period_start: string;
  period_end: string;
  payout_status: "pending" | "processing" | "paid";
}

export interface DashboardStats {
  total_earnings: number;
  pending_earnings: number;
  total_views: number;
  active_campaigns: number;
  avg_cpm: number;
  bio_bonus_active: boolean;
}

// ── Connected account ────────────────────────────────────────

export const connectedAccount: SocialAccount = {
  platform: "instagram",
  username: "alex.creates",
  display_name: "Alex Davis",
  avatar_url: "",
  followers: 12400,
  following: 890,
  posts_count: 347,
  engagement_rate: 4.2,
  account_type: "Creator",
  bio: "Creator & Entrepreneur | London 🇬🇧",
  verified: false,
  demographics: {
    age_groups: [
      { label: "13-17", pct: 3 },
      { label: "18-24", pct: 28 },
      { label: "25-34", pct: 42 },
      { label: "35-44", pct: 18 },
      { label: "45-54", pct: 6 },
      { label: "55+", pct: 3 },
    ],
    gender: [
      { label: "Female", pct: 58 },
      { label: "Male", pct: 39 },
      { label: "Other", pct: 3 },
    ],
    top_countries: [
      { code: "GB", name: "United Kingdom", pct: 45 },
      { code: "US", name: "United States", pct: 22 },
      { code: "CA", name: "Canada", pct: 8 },
      { code: "AU", name: "Australia", pct: 6 },
      { code: "DE", name: "Germany", pct: 4 },
    ],
    top_cities: [
      { name: "London", pct: 18 },
      { name: "Manchester", pct: 7 },
      { name: "New York", pct: 5 },
      { name: "Birmingham", pct: 4 },
      { name: "Toronto", pct: 3 },
    ],
  },
};

// ── Available campaigns (for discovery) ──────────────────────

export const availableCampaigns: Campaign[] = [
  {
    id: "c1", brand_name: "GlowSkin", brand_logo_initials: "GS", brand_color: "#E88D67",
    title: "Spring Glow Campaign", description: "Promote the new GlowSkin vitamin C serum with a lifestyle Reel. Show your morning routine incorporating the product.",
    content_type: "reel", platform: "instagram",
    caption: "My skin has been glowing since I found @GlowSkin ✨ Use code POSTIE20 for 20% off #ad #GlowSkin",
    cpm_rate: 5.0, bio_bonus_cpm_rate: 5.25,
    start_date: "2026-03-25", end_date: "2026-04-15", status: "open",
    category: "Beauty", min_followers: 5000, spots_total: 50, spots_filled: 32, match_score: 92,
  },
  {
    id: "c2", brand_name: "FitFuel", brand_logo_initials: "FF", brand_color: "#4CAF50",
    title: "Protein Bar Launch", description: "Share a carousel post showing the new FitFuel protein bar range in your active lifestyle.",
    content_type: "carousel", platform: "instagram",
    caption: "Fuelling my workouts with @FitFuel 💪 New flavours just dropped! #ad #FitFuel",
    cpm_rate: 4.5, bio_bonus_cpm_rate: 4.73,
    start_date: "2026-03-28", end_date: "2026-04-20", status: "open",
    category: "Fitness", min_followers: 3000, spots_total: 80, spots_filled: 41, match_score: 78,
  },
  {
    id: "c3", brand_name: "TechNova", brand_logo_initials: "TN", brand_color: "#2196F3",
    title: "Smart Watch Reveal", description: "Post a lifestyle image wearing the TechNova X1 smart watch. Focus on the fitness tracking features.",
    content_type: "image", platform: "instagram",
    caption: "Been wearing the @TechNova X1 all week — the fitness tracking is insane 🔥 #ad",
    cpm_rate: 6.0, bio_bonus_cpm_rate: 6.3,
    start_date: "2026-04-01", end_date: "2026-04-30", status: "upcoming",
    category: "Tech", min_followers: 10000, spots_total: 30, spots_filled: 12, match_score: 85,
  },
  {
    id: "c5", brand_name: "Nomad Coffee", brand_logo_initials: "NC", brand_color: "#795548",
    title: "Morning Ritual Series", description: "Create a short video featuring Nomad Coffee in your morning routine. Keep it authentic and lifestyle-focused.",
    content_type: "reel", platform: "instagram",
    caption: "My mornings start with @NomadCoffee ☕️ The single-origin blend hits different #ad #NomadCoffee",
    cpm_rate: 4.0, bio_bonus_cpm_rate: 4.2,
    start_date: "2026-04-05", end_date: "2026-05-05", status: "open",
    category: "Food & Drink", min_followers: 2000, spots_total: 100, spots_filled: 67, match_score: 88,
  },
  {
    id: "c6", brand_name: "Luxe Travel", brand_logo_initials: "LT", brand_color: "#9C27B0",
    title: "Weekend Getaway Guide", description: "Share a carousel of your favourite UK weekend getaway spots, tagging Luxe Travel as your booking partner.",
    content_type: "carousel", platform: "instagram",
    caption: "My top 5 UK weekend escapes 🏡✨ Book through @LuxeTravel for the best deals #ad #LuxeTravel",
    cpm_rate: 7.5, bio_bonus_cpm_rate: 7.88,
    start_date: "2026-04-10", end_date: "2026-05-10", status: "upcoming",
    category: "Travel", min_followers: 8000, spots_total: 25, spots_filled: 8, match_score: 72,
  },
  {
    id: "c7", brand_name: "PulseAudio", brand_logo_initials: "PA", brand_color: "#FF5722",
    title: "Wireless Earbuds Review", description: "Create a TikTok video reviewing the PulseAudio Pro earbuds. Focus on sound quality, comfort, and battery life.",
    content_type: "video", platform: "tiktok",
    caption: "These earbuds are a game changer 🎧 @PulseAudio Pro - link in bio #ad #PulseAudio",
    cpm_rate: 5.5, bio_bonus_cpm_rate: 5.78,
    start_date: "2026-03-30", end_date: "2026-04-30", status: "open",
    category: "Tech", min_followers: 5000, spots_total: 40, spots_filled: 22, match_score: 80,
  },
  {
    id: "c8", brand_name: "StyleVault", brand_logo_initials: "SV", brand_color: "#E91E63",
    title: "Spring Fashion Haul", description: "Post a thread showing your spring wardrobe refresh featuring StyleVault pieces.",
    content_type: "thread", platform: "twitter",
    caption: "Spring wardrobe refresh with @StyleVault 🌸 Here are my top picks from their new collection #ad",
    cpm_rate: 3.5, bio_bonus_cpm_rate: 3.68,
    start_date: "2026-04-01", end_date: "2026-04-30", status: "open",
    category: "Fashion", min_followers: 3000, spots_total: 60, spots_filled: 28, match_score: 65,
  },
];

// ── User's active campaigns (already joined) ─────────────────

export const activeCampaigns: ActiveCampaign[] = [
  {
    ...availableCampaigns[0], // GlowSkin
    status: "active",
    user_status: "scheduled",
    scheduled_date: "2026-03-27T10:00:00Z",
  },
  {
    id: "c4", brand_name: "CloudVPN", brand_logo_initials: "CV", brand_color: "#607D8B",
    title: "Digital Security Awareness", description: "Create a video about online privacy using CloudVPN.",
    content_type: "video", platform: "instagram",
    caption: "I protect my data with @CloudVPN — especially when travelling ✈️🔒 #ad #CloudVPN",
    cpm_rate: 7.0, bio_bonus_cpm_rate: 7.35,
    start_date: "2026-03-01", end_date: "2026-03-31", status: "active",
    category: "Tech", min_followers: 5000, spots_total: 30, spots_filled: 30,
    user_status: "posted", views: 89400, earned: 625.80,
  },
];

// ── Calendar events ──────────────────────────────────────────

export const calendarEvents: CalendarEvent[] = [
  { id: "ce1", date: "2026-03-23", campaign_title: "Digital Security Awareness", brand_name: "CloudVPN", content_type: "video", platform: "instagram", status: "due_today", time: "14:00" },
  { id: "ce2", date: "2026-03-25", campaign_title: "Spring Glow Campaign", brand_name: "GlowSkin", content_type: "reel", platform: "instagram", status: "scheduled", time: "10:00" },
  { id: "ce3", date: "2026-03-28", campaign_title: "Protein Bar Launch", brand_name: "FitFuel", content_type: "carousel", platform: "instagram", status: "scheduled", time: "14:00" },
  { id: "ce4", date: "2026-04-03", campaign_title: "Smart Watch Reveal", brand_name: "TechNova", content_type: "image", platform: "instagram", status: "scheduled", time: "11:00" },
  { id: "ce5", date: "2026-03-30", campaign_title: "Wireless Earbuds Review", brand_name: "PulseAudio", content_type: "video", platform: "tiktok", status: "scheduled", time: "16:00" },
];

// ── Earnings ─────────────────────────────────────────────────

export const earnings: Earning[] = [
  {
    id: "e1", campaign_id: "c4", brand_name: "CloudVPN", platform: "instagram",
    views: 89400, cpm_rate: 7.0, amount: 625.80,
    bio_bonus_applied: false, period_start: "2026-03-01", period_end: "2026-03-31",
    payout_status: "processing",
  },
  {
    id: "e2", campaign_id: "c1", brand_name: "GlowSkin", platform: "instagram",
    views: 34200, cpm_rate: 5.0, amount: 171.00,
    bio_bonus_applied: false, period_start: "2026-03-15", period_end: "2026-03-31",
    payout_status: "pending",
  },
];

// ── Dashboard stats ──────────────────────────────────────────

export const dashboardStats: DashboardStats = {
  total_earnings: 796.80,
  pending_earnings: 171.00,
  total_views: 123600,
  active_campaigns: 2,
  avg_cpm: 5.75,
  bio_bonus_active: false,
};
