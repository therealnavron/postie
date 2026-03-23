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
  count?: number;
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
  /** Average views on recent posts — used for earnings estimates */
  avg_recent_views: number;
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
  post_type: PostType;
  posting_to: { platform: Platform; placement: string };
  media: CampaignMedia;
  caption: string;
  hashtags: string[];
  cpm_rate: number;
  bio_bonus_cpm_rate: number;
  start_date: string;
  end_date: string;
  status: "open" | "active" | "upcoming" | "completed";
  category: string;
  auto_post: boolean;
  keep_days: number;
  spots_total: number;
  spots_filled: number;
  match_score?: number;
}

export interface ActiveCampaign extends Campaign {
  user_status: "joined" | "posted" | "scheduled" | "auto_posted";
  scheduled_date?: string;
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

// ── Brand-side types ─────────────────────────────────────────

export type BrandCategory =
  | "ecommerce"
  | "food"
  | "gambling"
  | "tech"
  | "fashion"
  | "beauty"
  | "fitness"
  | "travel"
  | "finance"
  | "entertainment"
  | "other";

export const brandCategories: { value: BrandCategory; label: string }[] = [
  { value: "ecommerce", label: "E-Commerce" },
  { value: "food", label: "Food & Drink" },
  { value: "gambling", label: "Gambling" },
  { value: "tech", label: "Technology" },
  { value: "fashion", label: "Fashion" },
  { value: "beauty", label: "Beauty" },
  { value: "fitness", label: "Fitness" },
  { value: "travel", label: "Travel" },
  { value: "finance", label: "Finance" },
  { value: "entertainment", label: "Entertainment" },
  { value: "other", label: "Other" },
];

export type CampaignStyle = "brand_growth" | "viral_content";

export interface BrandAccount {
  id: string;
  brand_name: string;
  brand_initials: string;
  brand_color: string;
  category: BrandCategory;
  contact_name: string;
  work_email: string;
  balance: number;
}

export interface BrandCampaign {
  id: string;
  title: string;
  style: CampaignStyle;
  status: "active" | "scheduled" | "completed" | "draft";
  content_type: PostType;
  budget: number;
  spent: number;
  total_views: number;
  total_unique_accounts: number;
  total_unique_posts: number;
  cpm_rate: number;
  start_date: string;
  end_date: string;
  demographics: Demographics;
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
  avg_recent_views: 8200,
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

// ── Available campaigns (for discovery) — CPMs now $0.20–$1.00 ──

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
    cpm_rate: 0.65, bio_bonus_cpm_rate: 0.68,
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
    cpm_rate: 0.45, bio_bonus_cpm_rate: 0.47,
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
    cpm_rate: 0.80, bio_bonus_cpm_rate: 0.84,
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
    cpm_rate: 0.40, bio_bonus_cpm_rate: 0.42,
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
    cpm_rate: 1.00, bio_bonus_cpm_rate: 1.05,
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
    cpm_rate: 0.55, bio_bonus_cpm_rate: 0.58,
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
    cpm_rate: 0.35, bio_bonus_cpm_rate: 0.37,
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
    cpm_rate: 0.20, bio_bonus_cpm_rate: 0.21,
    start_date: "2026-03-30", end_date: "2026-04-15", status: "open",
    category: "Wellness", auto_post: true, keep_days: 1,
    spots_total: 120, spots_filled: 54, match_score: 74,
  },
];

// ── User's active campaigns ──────────────────────────────────

export const activeCampaigns: ActiveCampaign[] = [
  {
    ...availableCampaigns[0],
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
    cpm_rate: 0.70, bio_bonus_cpm_rate: 0.74,
    start_date: "2026-03-01", end_date: "2026-03-31", status: "active",
    category: "Tech", auto_post: true, keep_days: 30,
    spots_total: 30, spots_filled: 30,
    user_status: "auto_posted", posted_date: "2026-03-05",
    views: 89400, earned: 62.58,
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
    views: 89400, cpm_rate: 0.70, amount: 62.58,
    bio_bonus_applied: false, period_start: "2026-03-01", period_end: "2026-03-31",
    payout_status: "processing",
  },
  {
    id: "e2", campaign_id: "c1", brand_name: "GlowSkin", platform: "instagram",
    views: 34200, cpm_rate: 0.65, amount: 22.23,
    bio_bonus_applied: false, period_start: "2026-03-15", period_end: "2026-03-31",
    payout_status: "pending",
  },
];

// ── Dashboard stats ──────────────────────────────────────────

export const dashboardStats: DashboardStats = {
  total_earnings: 84.81,
  pending_earnings: 22.23,
  total_views: 123600,
  active_campaigns: 2,
  avg_cpm: 0.65,
  bio_bonus_active: false,
};

// ── Brand-side demo data ─────────────────────────────────────

export const demoBrandAccount: BrandAccount = {
  id: "b1",
  brand_name: "CloudVPN",
  brand_initials: "CV",
  brand_color: "#607D8B",
  category: "tech",
  contact_name: "Sarah Chen",
  work_email: "sarah@cloudvpn.io",
  balance: 24_350.00,
};

export const demoBrandCampaigns: BrandCampaign[] = [
  {
    id: "bc1",
    title: "Digital Security Awareness",
    style: "brand_growth",
    status: "active",
    content_type: "video",
    budget: 50000,
    spent: 38_420.00,
    total_views: 54_885_714,
    total_unique_accounts: 847,
    total_unique_posts: 1_234,
    cpm_rate: 0.70,
    start_date: "2026-03-01",
    end_date: "2026-03-31",
    demographics: {
      age_groups: [
        { label: "13-17", pct: 4 },
        { label: "18-24", pct: 31 },
        { label: "25-34", pct: 38 },
        { label: "35-44", pct: 17 },
        { label: "45-54", pct: 7 },
        { label: "55+", pct: 3 },
      ],
      gender: [
        { label: "Female", pct: 46 },
        { label: "Male", pct: 51 },
        { label: "Other", pct: 3 },
      ],
      top_countries: [
        { code: "GB", name: "United Kingdom", pct: 38 },
        { code: "US", name: "United States", pct: 28 },
        { code: "CA", name: "Canada", pct: 9 },
        { code: "AU", name: "Australia", pct: 7 },
        { code: "DE", name: "Germany", pct: 5 },
      ],
      top_cities: [
        { name: "London", pct: 14 },
        { name: "New York", pct: 8 },
        { name: "Manchester", pct: 5 },
        { name: "Toronto", pct: 4 },
        { name: "Sydney", pct: 3 },
      ],
    },
  },
  {
    id: "bc2",
    title: "VPN for Gamers",
    style: "viral_content",
    status: "completed",
    content_type: "reel",
    budget: 25000,
    spent: 25000,
    total_views: 41_666_667,
    total_unique_accounts: 412,
    total_unique_posts: 620,
    cpm_rate: 0.60,
    start_date: "2026-02-01",
    end_date: "2026-02-28",
    demographics: {
      age_groups: [
        { label: "13-17", pct: 12 },
        { label: "18-24", pct: 44 },
        { label: "25-34", pct: 28 },
        { label: "35-44", pct: 10 },
        { label: "45-54", pct: 4 },
        { label: "55+", pct: 2 },
      ],
      gender: [
        { label: "Female", pct: 28 },
        { label: "Male", pct: 69 },
        { label: "Other", pct: 3 },
      ],
      top_countries: [
        { code: "US", name: "United States", pct: 42 },
        { code: "GB", name: "United Kingdom", pct: 22 },
        { code: "CA", name: "Canada", pct: 11 },
        { code: "DE", name: "Germany", pct: 6 },
        { code: "FR", name: "France", pct: 4 },
      ],
      top_cities: [
        { name: "New York", pct: 10 },
        { name: "Los Angeles", pct: 8 },
        { name: "London", pct: 7 },
        { name: "Toronto", pct: 4 },
        { name: "Chicago", pct: 3 },
      ],
    },
  },
];

/** Brand Growth CPM tiers based on budget size */
export const brandGrowthTiers = [
  { min_budget: 50000, max_budget: 99999, cpm: 0.60, label: "£50k – £99k" },
  { min_budget: 100000, max_budget: 249999, cpm: 0.50, label: "£100k – £249k" },
  { min_budget: 250000, max_budget: 499999, cpm: 0.40, label: "£250k – £499k" },
  { min_budget: 500000, max_budget: 999999, cpm: 0.30, label: "£500k – £999k" },
  { min_budget: 1000000, max_budget: Infinity, cpm: 0.20, label: "£1M+" },
];
