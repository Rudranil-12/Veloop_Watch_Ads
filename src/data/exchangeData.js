// ---------------------------------------------------------------------------
// VELOOP Rewards — Exchange Center dummy data
// Values mirror the existing Gems -> VEs exchange logic from the current
// implementation (velooprewards.in/exchange-center). Swap this file for a
// live API response when the backend endpoint is ready — component props
// and shapes are designed to stay identical.
// ---------------------------------------------------------------------------

export const userBalance = {
  gems: 420,
  ves: 3850,
};

// requiredGems / receiveVEs preserve the existing exchange rates.
export const exchangeOptions = [
  {
    id: 'exchange-01',
    type: 'gem-to-ve',
    label: 'Daily Gem Conversion',
    description: 'Convert your earned Gems into VEs.',
    requiredGems: 28,
    receiveVEs: 151,
    watchAd: true,
    available: true,
  },
  {
    id: 'exchange-02',
    type: 'gem-to-ve',
    label: 'Bonus Gem Conversion',
    description: 'A larger conversion for eligible members.',
    requiredGems: 39,
    receiveVEs: 168,
    watchAd: true,
    available: true,
  },
  {
    id: 'exchange-03',
    type: 'gem-to-ve',
    label: 'Weekend Reward Conversion',
    description: 'Limited-time conversion opportunity.',
    requiredGems: 55,
    receiveVEs: 240,
    watchAd: false,
    available: true,
  },
  {
    id: 'exchange-04',
    type: 'gem-to-ve',
    label: 'Milestone Conversion',
    description: 'Unlocked once you reach a Gem milestone.',
    requiredGems: 480,
    receiveVEs: 2100,
    watchAd: false,
    available: false,
  },
];

// "Watch Ad" reward tiers used to earn fresh Gems. durationSeconds drives the
// simulated ad-watch countdown; dailyLimit caps how many times each tier can
// be watched per day (dummy/local — wire up to a real ad SDK + backend cap
// when available).
export const adRewardOptions = [
  {
    id: 'ad-01',
    label: 'Quick Reward Ad',
    description: 'A short 5-second partner ad.',
    gems: 12,
    durationSeconds: 5,
    dailyLimit: 5,
  },
  {
    id: 'ad-02',
    label: 'Bonus Reward Ad',
    description: 'A longer ad for a bigger Gem reward.',
    gems: 25,
    durationSeconds: 8,
    dailyLimit: 2,
  },
  {
    id: 'ad-03',
    label: 'Mega Reward Ad',
    description: 'Our biggest single-ad Gem payout.',
    gems: 45,
    durationSeconds: 15,
    dailyLimit: 1,
  },
  {
    id: 'ad-04',
    label: 'Partner Spotlight Ad',
    description: 'Watch a featured partner ad for a steady top-up.',
    gems: 18,
    durationSeconds: 10,
    dailyLimit: 3,
  },
  {
    id: 'ad-05',
    label: 'Evening Booster Ad',
    description: 'A limited slot that unlocks later in the day.',
    gems: 30,
    durationSeconds: 12,
    dailyLimit: 2,
  },
];

// Non-ad ways to top up Gems — surfaced alongside the ad tiers so "Earn
// Gems" isn't watch-ad-only. Each links to an existing in-app destination.
export const gemEarnActions = [
  {
    id: 'earn-checkin',
    label: 'Daily Check-in',
    description: 'Open the app once a day to collect a small Gem bonus.',
    gems: 8,
    to: '/tasks',
    cta: 'Check in',
  },
  {
    id: 'earn-survey',
    label: 'Complete a Survey',
    description: 'Finish a short partner survey for a bigger reward.',
    gems: 60,
    to: '/offers',
    cta: 'Find surveys',
  },
  {
    id: 'earn-refer',
    label: 'Refer a Friend',
    description: 'Invite a friend — you both earn Gems when they join.',
    gems: 40,
    to: '/refer',
    cta: 'Invite friends',
  },
];

export const conversionHistory = [
  { id: 'hist-01', date: 'Today', requiredGems: 28, receiveVEs: 151, status: 'completed', timestamp: Date.now() - 1000 * 60 * 40 },
  { id: 'hist-02', date: 'Yesterday', requiredGems: 39, receiveVEs: 168, status: 'completed', timestamp: Date.now() - 1000 * 60 * 60 * 26 },
  { id: 'hist-03', date: '18 Aug', requiredGems: 25, receiveVEs: 120, status: 'completed', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 11 },
  { id: 'hist-04', date: '15 Aug', requiredGems: 28, receiveVEs: 151, status: 'failed', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 14 },
];

// ---------------------------------------------------------------------------
// Signed-in member. Swap for the authenticated session payload once the
// auth/backend layer is wired up.
// ---------------------------------------------------------------------------
export const userProfile = {
  name: 'Rudranil Mallick',
  handle: '@rudranil.m',
  tier: 'Premium Member',
  email: 'rudranil.mallick@veloop.rewards',
  phone: '+91 98300 XXX21',
  memberSince: 'Feb 2024',
  level: 7,
  referralCode: 'RUDRA7VLP',
  kyc: 'verified',
};

export const dailyGoalTarget = 200;

export const notificationsSeed = [
  { id: 'ntf-01', title: 'Daily goal completed', body: "You've earned today's reward — 222/200 VEs.", tone: 'success', time: '2m ago', read: false },
  { id: 'ntf-02', title: 'New offer unlocked', body: 'A limited-time Weekend Reward Conversion just opened up.', tone: 'gold', time: '1h ago', read: false },
  { id: 'ntf-03', title: 'Referral bonus credited', body: 'Ananya joined using your code — +40 Gems added.', tone: 'violet', time: 'Yesterday', read: true },
];

export const liveActivityFeed = [
  { id: 'act-01', label: 'Conversion completed', detail: '28 Gems → 151 VEs', tone: 'success', time: '40m ago' },
  { id: 'act-02', label: 'Ad reward collected', detail: '+12 Gems · Quick Reward Ad', tone: 'gold', time: '2h ago' },
  { id: 'act-03', label: 'Task completed', detail: 'Daily check-in streak · Day 12', tone: 'violet', time: '5h ago' },
];

export const withdrawHistory = [
  { id: 'wd-01', date: 'Yesterday', amountVEs: 1200, method: 'UPI', status: 'completed', timestamp: Date.now() - 1000 * 60 * 60 * 20 },
  { id: 'wd-02', date: '21 Aug', amountVEs: 850, method: 'Amazon Pay', status: 'completed', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 8 },
  { id: 'wd-03', date: '12 Aug', amountVEs: 2000, method: 'Bank Transfer', status: 'completed', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 17 },
  { id: 'wd-04', date: '02 Aug', amountVEs: 500, method: 'UPI', status: 'failed', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 27 },
];

export const withdrawMethods = [
  { id: 'upi', label: 'UPI', min: 100, note: 'Usually settles within minutes' },
  { id: 'bank', label: 'Bank Transfer', min: 500, note: '1–2 business days' },
  { id: 'amazon', label: 'Amazon Pay', min: 100, note: 'Instant gift voucher' },
  { id: 'paytm', label: 'Paytm Wallet', min: 100, note: 'Usually within an hour' },
];

export const tasksData = [
  {
    id: 'task-01', title: 'Daily Check-in', description: 'Open the app and check in to keep your streak alive.',
    reward: 8, unit: 'Gems', progress: 1, target: 1, status: 'completed', category: 'Daily',
  },
  {
    id: 'task-02', title: 'Watch 3 reward ads', description: 'Watch any three reward ads today.',
    reward: 20, unit: 'Gems', progress: 2, target: 3, status: 'active', category: 'Daily',
  },
  {
    id: 'task-03', title: 'Complete a survey', description: 'Finish one partner survey to earn a bigger reward.',
    reward: 60, unit: 'Gems', progress: 0, target: 1, status: 'active', category: 'Daily',
  },
  {
    id: 'task-04', title: '7-day login streak', description: 'Log in for 7 days in a row without missing one.',
    reward: 150, unit: 'Gems', progress: 5, target: 7, status: 'active', category: 'Weekly',
  },
  {
    id: 'task-05', title: 'Refer 2 friends', description: 'Invite 2 friends who complete sign-up this week.',
    reward: 300, unit: 'Gems', progress: 1, target: 2, status: 'active', category: 'Weekly',
  },
  {
    id: 'task-06', title: 'Reach Level 8', description: 'Keep earning to unlock the next member level.',
    reward: 500, unit: 'Gems', progress: 7, target: 8, status: 'locked', category: 'Milestone',
  },
];

export const offersData = [
  {
    id: 'offer-01', brand: 'Zynga Play', title: 'Install & reach Level 5', payout: 320, unit: 'Gems',
    difficulty: 'Medium', time: '~15 min', category: 'Games', trending: true,
  },
  {
    id: 'offer-02', brand: 'ShopKart', title: 'Complete your first purchase', payout: 550, unit: 'Gems',
    difficulty: 'Easy', time: '~5 min', category: 'Shopping', trending: true,
  },
  {
    id: 'offer-03', brand: 'FitPulse', title: 'Free trial sign-up', payout: 180, unit: 'Gems',
    difficulty: 'Easy', time: '~3 min', category: 'Health', trending: false,
  },
  {
    id: 'offer-04', brand: 'StreamBox', title: 'Watch 3 shows this week', payout: 240, unit: 'Gems',
    difficulty: 'Easy', time: '~10 min', category: 'Entertainment', trending: false,
  },
  {
    id: 'offer-05', brand: 'CoinQuest', title: 'Reach Dungeon Level 10', payout: 700, unit: 'Gems',
    difficulty: 'Hard', time: '~40 min', category: 'Games', trending: true,
  },
  {
    id: 'offer-06', brand: 'BrightBank', title: 'Open a savings account', payout: 1200, unit: 'Gems',
    difficulty: 'Medium', time: '~10 min', category: 'Finance', trending: false,
  },
];

export const supportFaqs = [
  { id: 'faq-01', q: 'How long does a Gem to VE conversion take?', a: 'Most conversions complete instantly. If a conversion fails, your Gems are automatically refunded to your balance.' },
  { id: 'faq-02', q: 'Why is my withdrawal still processing?', a: 'UPI and Amazon Pay withdrawals usually settle within minutes; bank transfers can take 1–2 business days depending on your bank.' },
  { id: 'faq-03', q: 'Do unused Gems or VEs expire?', a: 'No — Gems and VEs stay in your account with no expiry as long as your account remains active.' },
  { id: 'faq-04', q: 'How do referral rewards work?', a: 'Share your referral code — when a friend signs up and completes their first task, you both receive a Gem bonus.' },
];

export const supportChannels = [
  { id: 'chat', label: 'Live Chat', detail: 'Avg. reply time 2 min', status: 'online' },
  { id: 'email', label: 'support@veloop.rewards', detail: 'Replies within 24h', status: 'available' },
  { id: 'help', label: 'Help Center', detail: 'Guides & walkthroughs', status: 'available' },
];

export const exchangeRules = [
  'Only eligible Gems can be exchanged.',
  'Exchange rates are predefined by VELOOP Rewards.',
  'Available conversions may vary from time to time.',
  'A successful conversion cannot be duplicated.',
  'Your balance is updated immediately after a successful conversion.',
  'All platform terms and conditions apply.',
];

export const howItWorksSteps = [
  { id: 1, title: 'Earn Gems', description: 'Collect Gems through eligible activities across VELOOP Rewards.' },
  { id: 2, title: 'Choose a conversion', description: 'Pick an available Gem-to-VE conversion opportunity.' },
  { id: 3, title: 'Review the exchange', description: 'Check exactly how many VEs you will receive.' },
  { id: 4, title: 'Confirm', description: 'Approve the conversion from the confirmation screen.' },
  { id: 5, title: 'Receive VEs', description: 'Your VE balance updates instantly.' },
];

export const infoTooltips = {
  gems: 'Gems are reward credits earned through eligible activities on VELOOP Rewards.',
  ves: "VEs are VELOOP Rewards' virtual reward currency, usable for eligible redemption options according to platform rules.",
  rate: 'Conversion values are fixed by VELOOP Rewards and may be updated from time to time.',
  rules: 'Every conversion follows the exchange rules listed below. Please review them before converting.',
  earnGems: 'Watch a short partner ad to earn free Gems. Daily watch limits apply per ad tier.',
};
