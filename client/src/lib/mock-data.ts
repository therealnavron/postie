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

// ── Brand content analytics types ────────────────────────────

export type SentimentLabel = "positive" | "neutral" | "negative";

export interface ContentComment {
  id: string;
  username: string;
  text: string;
  likes: number;
  timestamp: string;
  sentiment: SentimentLabel;
  sentiment_score: number; // -1 to 1
}

export interface DailyMetric {
  date: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface ContentPost {
  id: string;
  campaign_id: string;
  creator_username: string;
  creator_display_name: string;
  platform: Platform;
  post_type: PostType;
  caption: string;
  posted_date: string;
  total_views: number;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  engagement_rate: number;
  daily_metrics: DailyMetric[];
  comments: ContentComment[];
  thumbnail_color: string; // placeholder color for demo
}

export interface SentimentSummary {
  campaign_id: string;
  overall_score: number; // -1 to 1
  overall_label: SentimentLabel;
  positive_pct: number;
  neutral_pct: number;
  negative_pct: number;
  total_comments_analysed: number;
  top_positive_keywords: string[];
  top_negative_keywords: string[];
  ai_summary: string;
  daily_sentiment: { date: string; positive: number; neutral: number; negative: number; avg_score: number }[];
}

// ── Helper: generate daily metrics from a start date ─────────
function generateDailyMetrics(startDate: string, days: number, baseViews: number): DailyMetric[] {
  const metrics: DailyMetric[] = [];
  const start = new Date(startDate);
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    // Views spike on day 1-3 then taper with organic growth
    const dayFactor = i < 1 ? 0.3 : i < 3 ? 1.2 : i < 7 ? 0.8 : i < 14 ? 0.5 : 0.25;
    const jitter = 0.7 + Math.random() * 0.6;
    const views = Math.round(baseViews * dayFactor * jitter);
    metrics.push({
      date: d.toISOString().slice(0, 10),
      views,
      likes: Math.round(views * (0.04 + Math.random() * 0.03)),
      comments: Math.round(views * (0.005 + Math.random() * 0.005)),
      shares: Math.round(views * (0.008 + Math.random() * 0.006)),
    });
  }
  return metrics;
}

// ── Demo content posts for campaign bc1 ──────────────────────
export const demoBrandContentPosts: ContentPost[] = [
  {
    id: "cp1", campaign_id: "bc1", creator_username: "alex.creates", creator_display_name: "Alex Davis",
    platform: "instagram", post_type: "reel",
    caption: "I protect my data with @CloudVPN — especially when travelling ✈️🔒 #ad #CloudVPN",
    posted_date: "2026-03-01", total_views: 892_400, total_likes: 34_210, total_comments: 1_847, total_shares: 5_120,
    engagement_rate: 4.6, daily_metrics: generateDailyMetrics("2026-03-01", 23, 48000),
    thumbnail_color: "#607D8B",
    comments: [
      { id: "cm1", username: "traveljane_", text: "Been using this for months, absolute game changer for public wifi!", likes: 234, timestamp: "2026-03-01T14:22:00Z", sentiment: "positive", sentiment_score: 0.92 },
      { id: "cm2", username: "digitalnom4d", text: "Does it actually slow down your connection though? 🤔", likes: 89, timestamp: "2026-03-01T15:10:00Z", sentiment: "neutral", sentiment_score: 0.1 },
      { id: "cm3", username: "cybersec_mike", text: "Good to see creators promoting online safety. CloudVPN is solid.", likes: 312, timestamp: "2026-03-01T16:44:00Z", sentiment: "positive", sentiment_score: 0.88 },
      { id: "cm4", username: "skept1cal", text: "Another VPN ad... they're all the same honestly", likes: 45, timestamp: "2026-03-02T08:30:00Z", sentiment: "negative", sentiment_score: -0.65 },
      { id: "cm5", username: "emma_adventures", text: "Just set this up before my Thailand trip, love it already ❤️", likes: 178, timestamp: "2026-03-02T10:15:00Z", sentiment: "positive", sentiment_score: 0.95 },
      { id: "cm6", username: "tech_reviews_uk", text: "CloudVPN consistently ranks top 3 in independent tests. Great pick.", likes: 267, timestamp: "2026-03-02T12:05:00Z", sentiment: "positive", sentiment_score: 0.85 },
      { id: "cm7", username: "privacy_matters", text: "I wish more people understood how important VPNs are. This is a good start.", likes: 156, timestamp: "2026-03-03T09:20:00Z", sentiment: "positive", sentiment_score: 0.72 },
      { id: "cm8", username: "mark_fx", text: "The price is a bit steep compared to some alternatives", likes: 34, timestamp: "2026-03-03T14:00:00Z", sentiment: "negative", sentiment_score: -0.45 },
    ],
  },
  {
    id: "cp2", campaign_id: "bc1", creator_username: "techsavvy.jo", creator_display_name: "Jo Thompson",
    platform: "instagram", post_type: "video",
    caption: "POV: You just connected to airport wifi without a VPN 😬🔓 vs with @CloudVPN 🔒✨ #CyberSecurity #ad",
    posted_date: "2026-03-03", total_views: 1_456_000, total_likes: 67_340, total_comments: 3_210, total_shares: 12_450,
    engagement_rate: 5.7, daily_metrics: generateDailyMetrics("2026-03-03", 21, 82000),
    thumbnail_color: "#455A64",
    comments: [
      { id: "cm9", username: "sarah_codes", text: "Lol the airport wifi skit had me dead 😂 but seriously, everyone needs this", likes: 567, timestamp: "2026-03-03T11:00:00Z", sentiment: "positive", sentiment_score: 0.88 },
      { id: "cm10", username: "no_ads_pls", text: "Skip ad", likes: 12, timestamp: "2026-03-03T11:30:00Z", sentiment: "negative", sentiment_score: -0.7 },
      { id: "cm11", username: "backpacker_dan", text: "Bro this literally saved me in Bali, the free wifi there is SKETCHY", likes: 890, timestamp: "2026-03-03T13:20:00Z", sentiment: "positive", sentiment_score: 0.91 },
      { id: "cm12", username: "lisa.london", text: "Love the edit quality on this! Also yes, VPNs are essential", likes: 234, timestamp: "2026-03-04T09:10:00Z", sentiment: "positive", sentiment_score: 0.82 },
      { id: "cm13", username: "budget_tech", text: "Is there a free version? Monthly subscriptions add up", likes: 78, timestamp: "2026-03-04T14:55:00Z", sentiment: "neutral", sentiment_score: -0.15 },
      { id: "cm14", username: "vpn_expert", text: "CloudVPN's no-log policy is verified by independent auditors. Top tier.", likes: 445, timestamp: "2026-03-05T08:30:00Z", sentiment: "positive", sentiment_score: 0.93 },
    ],
  },
  {
    id: "cp3", campaign_id: "bc1", creator_username: "lifewithlaura", creator_display_name: "Laura Chen",
    platform: "tiktok", post_type: "video",
    caption: "Things I never travel without: passport, charger, @CloudVPN 🧳🔐 #traveltok #ad",
    posted_date: "2026-03-05", total_views: 2_340_000, total_likes: 112_000, total_comments: 5_670, total_shares: 18_900,
    engagement_rate: 5.8, daily_metrics: generateDailyMetrics("2026-03-05", 19, 145000),
    thumbnail_color: "#78909C",
    comments: [
      { id: "cm15", username: "nomad_nina", text: "THIS. Every time I see someone banking on hotel wifi I cringe", likes: 1230, timestamp: "2026-03-05T10:00:00Z", sentiment: "positive", sentiment_score: 0.78 },
      { id: "cm16", username: "cheapflyer", text: "do I actually need a VPN though? genuine question", likes: 56, timestamp: "2026-03-05T11:20:00Z", sentiment: "neutral", sentiment_score: 0.05 },
      { id: "cm17", username: "securitynerdd", text: "Yes you do. Your data is worth more than you think.", likes: 678, timestamp: "2026-03-05T11:45:00Z", sentiment: "positive", sentiment_score: 0.7 },
      { id: "cm18", username: "hater_2026", text: "Paid promotion detected 🙄", likes: 23, timestamp: "2026-03-06T09:00:00Z", sentiment: "negative", sentiment_score: -0.8 },
      { id: "cm19", username: "devraj_k", text: "CloudVPN is genuinely one of the fastest I've used. No complaints.", likes: 445, timestamp: "2026-03-06T14:30:00Z", sentiment: "positive", sentiment_score: 0.9 },
    ],
  },
  {
    id: "cp4", campaign_id: "bc1", creator_username: "gadgetguru", creator_display_name: "Marcus Hill",
    platform: "instagram", post_type: "reel",
    caption: "3 reasons I switched to @CloudVPN (and stayed) 🔐 #techreview #ad #onlinesafety",
    posted_date: "2026-03-08", total_views: 678_900, total_likes: 28_900, total_comments: 1_560, total_shares: 4_230,
    engagement_rate: 5.1, daily_metrics: generateDailyMetrics("2026-03-08", 16, 52000),
    thumbnail_color: "#546E7A",
    comments: [
      { id: "cm20", username: "paultech", text: "Solid review. The kill switch feature is underrated.", likes: 345, timestamp: "2026-03-08T12:00:00Z", sentiment: "positive", sentiment_score: 0.85 },
      { id: "cm21", username: "jenny_streams", text: "Been using it to unblock content when I'm abroad. Works perfectly.", likes: 210, timestamp: "2026-03-08T15:30:00Z", sentiment: "positive", sentiment_score: 0.87 },
      { id: "cm22", username: "grumpyoldman", text: "VPNs are a waste of money if you have nothing to hide", likes: 15, timestamp: "2026-03-09T08:45:00Z", sentiment: "negative", sentiment_score: -0.72 },
      { id: "cm23", username: "infosec_daily", text: "That's not how privacy works. Everyone has something worth protecting.", likes: 890, timestamp: "2026-03-09T09:10:00Z", sentiment: "positive", sentiment_score: 0.68 },
    ],
  },
  {
    id: "cp5", campaign_id: "bc1", creator_username: "simplysophie", creator_display_name: "Sophie Williams",
    platform: "instagram", post_type: "slideshow",
    caption: "My digital safety essentials for working remotely 💻🔒 Swipe to see why @CloudVPN is a must-have #remotework #ad",
    posted_date: "2026-03-10", total_views: 445_200, total_likes: 19_800, total_comments: 980, total_shares: 2_870,
    engagement_rate: 5.3, daily_metrics: generateDailyMetrics("2026-03-10", 14, 38000),
    thumbnail_color: "#37474F",
    comments: [
      { id: "cm24", username: "remoteworker_amy", text: "As a remote worker I can confirm — VPN is non-negotiable at coffee shops", likes: 234, timestamp: "2026-03-10T13:00:00Z", sentiment: "positive", sentiment_score: 0.88 },
      { id: "cm25", username: "coffeeshop_coder", text: "Great carousel design! Also CloudVPN is genuinely good.", likes: 123, timestamp: "2026-03-10T14:20:00Z", sentiment: "positive", sentiment_score: 0.8 },
      { id: "cm26", username: "skeptic123", text: "How much did they pay you for this", likes: 8, timestamp: "2026-03-11T10:00:00Z", sentiment: "negative", sentiment_score: -0.55 },
    ],
  },
  {
    id: "cp6", campaign_id: "bc1", creator_username: "fitandfocused", creator_display_name: "Priya Patel",
    platform: "tiktok", post_type: "video",
    caption: "Streaming my workouts abroad without buffering? @CloudVPN makes it happen 💪🌍 #fitnesstok #ad",
    posted_date: "2026-03-12", total_views: 3_120_000, total_likes: 145_000, total_comments: 7_890, total_shares: 22_100,
    engagement_rate: 5.6, daily_metrics: generateDailyMetrics("2026-03-12", 12, 310000),
    thumbnail_color: "#263238",
    comments: [
      { id: "cm27", username: "gymrat_2026", text: "Wait you can use this to access your home streaming while travelling?? Game changer", likes: 2340, timestamp: "2026-03-12T09:00:00Z", sentiment: "positive", sentiment_score: 0.94 },
      { id: "cm28", username: "fitnessqueen", text: "Love this tip! I always lose access to my workout apps abroad", likes: 890, timestamp: "2026-03-12T10:30:00Z", sentiment: "positive", sentiment_score: 0.86 },
      { id: "cm29", username: "trollface99", text: "Nobody asked", likes: 5, timestamp: "2026-03-12T11:00:00Z", sentiment: "negative", sentiment_score: -0.9 },
      { id: "cm30", username: "honest_reviewer", text: "I've tried 5 VPNs and CloudVPN genuinely has the least speed drop. Respect for recommending a good one.", likes: 1560, timestamp: "2026-03-13T08:00:00Z", sentiment: "positive", sentiment_score: 0.95 },
    ],
  },
];

// ── Sentiment summary for campaign bc1 ───────────────────────
export const demoBrandSentiment: SentimentSummary = {
  campaign_id: "bc1",
  overall_score: 0.72,
  overall_label: "positive",
  positive_pct: 68,
  neutral_pct: 18,
  negative_pct: 14,
  total_comments_analysed: 21_157,
  top_positive_keywords: ["game changer", "essential", "fast", "love it", "solid", "safe", "trust", "best VPN", "easy to use", "recommend"],
  top_negative_keywords: ["expensive", "paid ad", "slow", "subscription", "unnecessary", "waste"],
  ai_summary: `Overall audience sentiment for the Digital Security Awareness campaign is strongly positive (72% score). The majority of comments reflect genuine appreciation for the product, with many users sharing personal experiences using CloudVPN while travelling or working remotely.\n\nKey positive themes include: perceived speed advantage over competitors, practical use cases (airport wifi, coffee shops, streaming abroad), and trust in CloudVPN's independent security audits.\n\nNegative sentiment (14%) is primarily driven by: scepticism towards paid promotions in general, price concerns compared to free alternatives, and a small minority dismissing VPN necessity altogether.\n\nNeutral comments (18%) tend to be genuine questions about features, pricing, or whether a VPN is needed — presenting an opportunity for educational follow-up content.\n\nRecommendation: Lean into the "real traveller" use case in future content. The airport/coffee shop wifi angle resonates most strongly. Consider addressing the price objection with a comparison or value breakdown.`,
  daily_sentiment: [
    { date: "2026-03-01", positive: 72, neutral: 18, negative: 10, avg_score: 0.76 },
    { date: "2026-03-02", positive: 65, neutral: 22, negative: 13, avg_score: 0.68 },
    { date: "2026-03-03", positive: 70, neutral: 17, negative: 13, avg_score: 0.72 },
    { date: "2026-03-04", positive: 68, neutral: 19, negative: 13, avg_score: 0.70 },
    { date: "2026-03-05", positive: 74, neutral: 15, negative: 11, avg_score: 0.78 },
    { date: "2026-03-06", positive: 66, neutral: 20, negative: 14, avg_score: 0.66 },
    { date: "2026-03-07", positive: 71, neutral: 16, negative: 13, avg_score: 0.73 },
    { date: "2026-03-08", positive: 69, neutral: 18, negative: 13, avg_score: 0.71 },
    { date: "2026-03-09", positive: 63, neutral: 21, negative: 16, avg_score: 0.62 },
    { date: "2026-03-10", positive: 72, neutral: 17, negative: 11, avg_score: 0.75 },
    { date: "2026-03-11", positive: 67, neutral: 19, negative: 14, avg_score: 0.68 },
    { date: "2026-03-12", positive: 75, neutral: 14, negative: 11, avg_score: 0.79 },
    { date: "2026-03-13", positive: 70, neutral: 18, negative: 12, avg_score: 0.73 },
    { date: "2026-03-14", positive: 68, neutral: 20, negative: 12, avg_score: 0.71 },
    { date: "2026-03-15", positive: 66, neutral: 21, negative: 13, avg_score: 0.68 },
    { date: "2026-03-16", positive: 71, neutral: 17, negative: 12, avg_score: 0.74 },
    { date: "2026-03-17", positive: 69, neutral: 18, negative: 13, avg_score: 0.70 },
    { date: "2026-03-18", positive: 73, neutral: 15, negative: 12, avg_score: 0.76 },
    { date: "2026-03-19", positive: 67, neutral: 20, negative: 13, avg_score: 0.69 },
    { date: "2026-03-20", positive: 70, neutral: 18, negative: 12, avg_score: 0.72 },
    { date: "2026-03-21", positive: 72, neutral: 16, negative: 12, avg_score: 0.74 },
    { date: "2026-03-22", positive: 68, neutral: 19, negative: 13, avg_score: 0.70 },
    { date: "2026-03-23", positive: 71, neutral: 17, negative: 12, avg_score: 0.73 },
  ],
};

/** Brand Growth CPM tiers based on budget size */
export const brandGrowthTiers = [
  { min_budget: 50000, max_budget: 99999, cpm: 0.60, label: "£50k – £99k" },
  { min_budget: 100000, max_budget: 249999, cpm: 0.50, label: "£100k – £249k" },
  { min_budget: 250000, max_budget: 499999, cpm: 0.40, label: "£250k – £499k" },
  { min_budget: 500000, max_budget: 999999, cpm: 0.30, label: "£500k – £999k" },
  { min_budget: 1000000, max_budget: Infinity, cpm: 0.20, label: "£1M+" },
];
