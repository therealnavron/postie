// ── Types ────────────────────────────────────────────────────

export type Platform = "instagram" | "tiktok" | "twitter";

export type PostType =
  | "story"
  | "highlight"
  | "profile_picture"
  | "video"
  | "slideshow"
  | "single_image"
  | "reel"
  | "thread";

export type MediaType = "image" | "video" | "slideshow";

export interface CampaignMedia {
  type: MediaType;
  /** Number of slides if slideshow */
  count?: number;
  /** Human-readable description of what will be posted */
  description: string;
}

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
  /** What kind of post the brand is making on the creator's account */
  post_type: PostType;
  /** Where it's posting — platform + placement */
  posting_to: { platform: Platform; placement: string };
  /** Media that will be posted */
  media: CampaignMedia;
  caption: string;
  hashtags: string[];
  cpm_rate: number;
  bio_bonus_cpm_rate: number;
  start_date: string;
  end_date: string;
  status: "open" | "active" | "upcoming" | "completed";
  category: string;
  /** Auto-post: we post on the creator's behalf */
  auto_post: boolean;
  /** How many days the post must stay up */
  keep_days: number;
  spots_total: number;
  spots_filled: number;
  match_score?: number;
}

export interface ActiveCampaign extends Campaign {
  user_status: "joined" | "posted" | "scheduled" | "auto_posted";
  scheduled_date?: string;
  /** When the post was published — used to calculate keep-until */
  posted_date?: string;
  views?: number;
  earned?: number;
}

export interface CalendarEvent {
  id: string;
  date: string;
  campaign_title: string;
  brand_name: string;
  post_type: PostType;
  platform: Platform;
  status: "scheduled" | "posted" | "due_today" | "overdue";
  auto_post: boolean;
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
    title: "Spring Glow Campaign",
    description: "We'll post a lifestyle Reel on your Instagram showing your morning routine with the GlowSkin vitamin C serum.",
    post_type: "reel",
    posting_to: { platform: "instagram", placement: "Feed + Reels" },
    media: { type: "video", description: "15-second lifestyle Reel featuring GlowSkin serum in morning routine" },
    caption: "My skin has been glowing since I found @GlowSkin ✨ Use code POSTIE20 for 20% off",
    hashtags: ["#ad", "#GlowSkin", "#SkincareRoutine", "#VitaminC"],
    cpm_rate: 5.0, bio_bonus_cpm_rate: 5.25,
    start_date: "2026-03-25", end_date: "2026-04-15", status: "open",
    category: "Beauty", auto_post: true, keep_days: 14,
    spots_total: 50, spots_filled: 32, match_score: 92,
  },
  {
    id: "c2", brand_name: "FitFuel", brand_logo_initials: "FF", brand_color: "#4CAF50",
    title: "Protein Bar Launch",
    description: "A 4-image slideshow will be posted to your feed showcasing the new FitFuel protein bar range in an active lifestyle setting.",
    post_type: "slideshow",
    posting_to: { platform: "instagram", placement: "Feed (Carousel)" },
    media: { type: "slideshow", count: 4, description: "4 lifestyle images: gym bag flat-lay, mid-workout shot, close-up product, post-gym selfie" },
    caption: "Fuelling my workouts with @FitFuel 💪 New flavours just dropped!",
    hashtags: ["#ad", "#FitFuel", "#ProteinBar", "#FitnessLifestyle"],
    cpm_rate: 4.5, bio_bonus_cpm_rate: 4.73,
    start_date: "2026-03-28", end_date: "2026-04-20", status: "open",
    category: "Fitness", auto_post: true, keep_days: 30,
    spots_total: 80, spots_filled: 41, match_score: 78,
  },
  {
    id: "c3", brand_name: "TechNova", brand_logo_initials: "TN", brand_color: "#2196F3",
    title: "Smart Watch Reveal",
    description: "A single image post on your Instagram feed — you wearing the TechNova X1 smart watch in a lifestyle setting.",
    post_type: "single_image",
    posting_to: { platform: "instagram", placement: "Feed" },
    media: { type: "image", description: "High-quality lifestyle photo wearing TechNova X1 watch" },
    caption: "Been wearing the @TechNova X1 all week — the fitness tracking is insane 🔥",
    hashtags: ["#ad", "#TechNova", "#SmartWatch", "#FitnessTech"],
    cpm_rate: 6.0, bio_bonus_cpm_rate: 6.3,
    start_date: "2026-04-01", end_date: "2026-04-30", status: "upcoming",
    category: "Tech", auto_post: true, keep_days: 21,
    spots_total: 30, spots_filled: 12, match_score: 85,
  },
  {
    id: "c5", brand_name: "Nomad Coffee", brand_logo_initials: "NC", brand_color: "#795548",
    title: "Morning Ritual Series",
    description: "A short video posted to your Instagram Reels featuring Nomad Coffee in your morning routine. Authentic, lifestyle-focused.",
    post_type: "reel",
    posting_to: { platform: "instagram", placement: "Feed + Reels" },
    media: { type: "video", description: "20-second morning routine Reel — coffee preparation, first sip moment" },
    caption: "My mornings start with @NomadCoffee ☕️ The single-origin blend hits different",
    hashtags: ["#ad", "#NomadCoffee", "#MorningRoutine", "#CoffeeLover"],
    cpm_rate: 4.0, bio_bonus_cpm_rate: 4.2,
    start_date: "2026-04-05", end_date: "2026-05-05", status: "open",
    category: "Food & Drink", auto_post: true, keep_days: 7,
    spots_total: 100, spots_filled: 67, match_score: 88,
  },
  {
    id: "c6", brand_name: "Luxe Travel", brand_logo_initials: "LT", brand_color: "#9C27B0",
    title: "Weekend Getaway Guide",
    description: "A 5-image slideshow on your feed showcasing UK weekend getaway spots, tagging Luxe Travel as your booking partner.",
    post_type: "slideshow",
    posting_to: { platform: "instagram", placement: "Feed (Carousel)" },
    media: { type: "slideshow", count: 5, description: "5 scenic UK destination images with text overlays" },
    caption: "My top 5 UK weekend escapes 🏡✨ Book through @LuxeTravel for the best deals",
    hashtags: ["#ad", "#LuxeTravel", "#UKGetaway", "#WeekendTrip"],
    cpm_rate: 7.5, bio_bonus_cpm_rate: 7.88,
    start_date: "2026-04-10", end_date: "2026-05-10", status: "upcoming",
    category: "Travel", auto_post: true, keep_days: 30,
    spots_total: 25, spots_filled: 8, match_score: 72,
  },
  {
    id: "c7", brand_name: "PulseAudio", brand_logo_initials: "PA", brand_color: "#FF5722",
    title: "Wireless Earbuds Review",
    description: "A TikTok video will be posted to your account reviewing the PulseAudio Pro earbuds — sound quality, comfort, battery life.",
    post_type: "video",
    posting_to: { platform: "tiktok", placement: "For You feed" },
    media: { type: "video", description: "30-second product review video — unboxing, testing, reaction" },
    caption: "These earbuds are a game changer 🎧 @PulseAudio Pro - link in bio",
    hashtags: ["#ad", "#PulseAudio", "#Earbuds", "#TechReview"],
    cpm_rate: 5.5, bio_bonus_cpm_rate: 5.78,
    start_date: "2026-03-30", end_date: "2026-04-30", status: "open",
    category: "Tech", auto_post: true, keep_days: 14,
    spots_total: 40, spots_filled: 22, match_score: 80,
  },
  {
    id: "c8", brand_name: "StyleVault", brand_logo_initials: "SV", brand_color: "#E91E63",
    title: "Spring Fashion Haul",
    description: "A thread will be posted on your X account showing spring wardrobe picks from StyleVault's new collection.",
    post_type: "thread",
    posting_to: { platform: "twitter", placement: "Timeline (Thread)" },
    media: { type: "slideshow", count: 3, description: "3-tweet thread with styled outfit images per tweet" },
    caption: "Spring wardrobe refresh with @StyleVault 🌸 Here are my top picks from their new collection",
    hashtags: ["#ad", "#StyleVault", "#SpringFashion"],
    cpm_rate: 3.5, bio_bonus_cpm_rate: 3.68,
    start_date: "2026-04-01", end_date: "2026-04-30", status: "open",
    category: "Fashion", auto_post: true, keep_days: 21,
    spots_total: 60, spots_filled: 28, match_score: 65,
  },
  {
    id: "c9", brand_name: "ZenSpa", brand_logo_initials: "ZS", brand_color: "#00897B",
    title: "Self-Care Sunday",
    description: "We'll add a branded Story to your Instagram featuring ZenSpa's new essential oil diffuser. 24-hour story — no feed clutter.",
    post_type: "story",
    posting_to: { platform: "instagram", placement: "Stories" },
    media: { type: "video", description: "15-second Story — candle-lit room, diffuser mist, relaxation vibes" },
    caption: "Sunday self-care with @ZenSpa 🧘‍♀️ Their new diffuser is everything",
    hashtags: ["#ad", "#ZenSpa", "#SelfCare", "#SundayVibes"],
    cpm_rate: 3.0, bio_bonus_cpm_rate: 3.15,
    start_date: "2026-03-30", end_date: "2026-04-15", status: "open",
    category: "Wellness", auto_post: true, keep_days: 1,
    spots_total: 120, spots_filled: 54, match_score: 74,
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
    title: "Digital Security Awareness",
    description: "A video was auto-posted to your Instagram about online privacy using CloudVPN.",
    post_type: "video",
    posting_to: { platform: "instagram", placement: "Feed + Reels" },
    media: { type: "video", description: "30-second explainer on VPN benefits when travelling" },
    caption: "I protect my data with @CloudVPN — especially when travelling ✈️🔒",
    hashtags: ["#ad", "#CloudVPN", "#OnlinePrivacy", "#CyberSecurity"],
    cpm_rate: 7.0, bio_bonus_cpm_rate: 7.35,
    start_date: "2026-03-01", end_date: "2026-03-31", status: "active",
    category: "Tech", auto_post: true, keep_days: 30,
    spots_total: 30, spots_filled: 30,
    user_status: "auto_posted", posted_date: "2026-03-05",
    views: 89400, earned: 625.80,
  },
];

// ── Calendar events ──────────────────────────────────────────

export const calendarEvents: CalendarEvent[] = [
  { id: "ce1", date: "2026-03-23", campaign_title: "Digital Security Awareness", brand_name: "CloudVPN", post_type: "video", platform: "instagram", status: "due_today", auto_post: true, time: "14:00" },
  { id: "ce2", date: "2026-03-25", campaign_title: "Spring Glow Campaign", brand_name: "GlowSkin", post_type: "reel", platform: "instagram", status: "scheduled", auto_post: true, time: "10:00" },
  { id: "ce3", date: "2026-03-28", campaign_title: "Protein Bar Launch", brand_name: "FitFuel", post_type: "slideshow", platform: "instagram", status: "scheduled", auto_post: true, time: "14:00" },
  { id: "ce4", date: "2026-04-03", campaign_title: "Smart Watch Reveal", brand_name: "TechNova", post_type: "single_image", platform: "instagram", status: "scheduled", auto_post: true, time: "11:00" },
  { id: "ce5", date: "2026-03-30", campaign_title: "Wireless Earbuds Review", brand_name: "PulseAudio", post_type: "video", platform: "tiktok", status: "scheduled", auto_post: true, time: "16:00" },
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
