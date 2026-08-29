import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  userBalance,
  userProfile,
  conversionHistory,
  withdrawHistory as withdrawHistorySeed,
  notificationsSeed,
  dailyGoalTarget,
  liveActivityFeed,
} from '../data/exchangeData';
import { loadUserState, saveUserState } from '../utils/storage';

// ---------------------------------------------------------------------------
// AppDataContext
// A single, lightweight "live" data layer shared by every page (Topbar,
// Sidebar, Dashboard, Wallet, Withdraw History, Profile...). It simulates a
// real-time backend: balances tick, notifications arrive, and every
// conversion/ad-watch/withdrawal is appended to shared history so the whole
// app stays in sync — the same way a real socket/polling layer would.
// Swap the setInterval simulations for real subscriptions when the backend
// is ready; component-facing shapes are designed to stay identical.
//
// Persistence: every piece of data that the user "owns" (balance, history,
// withdrawals, notifications, activity feed, ad-watch limits) is saved to
// localStorage under a key namespaced with the signed-in member's id, and
// restored on load — so a refresh no longer wipes progress, and switching
// between different member accounts on the same browser never mixes their
// data together. Swap `userId` for the real authenticated session id once a
// backend/auth layer exists.
// ---------------------------------------------------------------------------

const AppDataContext = createContext(null);

// How often "Earn Gems" watch limits (per-ad tiers and the daily total)
// automatically reset — 24 hours after the current window started.
const ADS_WINDOW_MS = 24 * 60 * 60 * 1000;
const ADS_DAILY_LIMIT = 6;

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function AppDataProvider({ children }) {
  const [profile] = useState(userProfile);
  // Identifies the current member for storage purposes — falls back to
  // 'guest' if a profile somehow has no email yet.
  const userId = profile?.email || 'guest';

  const [balance, setBalance] = useState(() => loadUserState(userId, 'balance', userBalance));
  const [history, setHistory] = useState(() => loadUserState(userId, 'history', conversionHistory));
  const [withdrawals, setWithdrawals] = useState(() => loadUserState(userId, 'withdrawals', withdrawHistorySeed));
  const [notifications, setNotifications] = useState(() => loadUserState(userId, 'notifications', notificationsSeed));
  const [activity, setActivity] = useState(() => loadUserState(userId, 'activity', liveActivityFeed));

  const [adsWatchedToday, setAdsWatchedToday] = useState(() => loadUserState(userId, 'adsWatchedToday', 0));
  const [adWatchCounts, setAdWatchCounts] = useState(() => loadUserState(userId, 'adWatchCounts', {}));
  const [adWindowStart, setAdWindowStart] = useState(() => loadUserState(userId, 'adWindowStart', Date.now()));
  const [adsDailyLimit] = useState(ADS_DAILY_LIMIT);

  const [connection, setConnection] = useState('live'); // live | syncing

  // --- Persist every owned slice of state whenever it changes ------------
  useEffect(() => { saveUserState(userId, 'balance', balance); }, [userId, balance]);
  useEffect(() => { saveUserState(userId, 'history', history); }, [userId, history]);
  useEffect(() => { saveUserState(userId, 'withdrawals', withdrawals); }, [userId, withdrawals]);
  useEffect(() => { saveUserState(userId, 'notifications', notifications); }, [userId, notifications]);
  useEffect(() => { saveUserState(userId, 'activity', activity); }, [userId, activity]);
  useEffect(() => { saveUserState(userId, 'adsWatchedToday', adsWatchedToday); }, [userId, adsWatchedToday]);
  useEffect(() => { saveUserState(userId, 'adWatchCounts', adWatchCounts); }, [userId, adWatchCounts]);
  useEffect(() => { saveUserState(userId, 'adWindowStart', adWindowStart); }, [userId, adWindowStart]);

  const todayEarnings = useMemo(
    () => history
      .filter((h) => h.date === 'Today' && h.status === 'completed')
      .reduce((sum, h) => sum + h.receiveVEs, 0),
    [history],
  );

  const lifetimeEarnings = useMemo(
    () => 12354 + history.reduce((sum, h) => (h.status === 'completed' ? sum + h.receiveVEs : sum), 0),
    [history],
  );

  const goalProgress = Math.min(100, Math.round((todayEarnings / dailyGoalTarget) * 100));
  const goalCompleted = todayEarnings >= dailyGoalTarget;

  const pushNotification = useCallback((notification) => {
    setNotifications((prev) => [
      { id: uid('ntf'), read: false, time: 'Just now', ...notification },
      ...prev,
    ].slice(0, 20));
  }, []);

  const pushActivity = useCallback((entry) => {
    setActivity((prev) => [{ id: uid('act'), time: 'Just now', ...entry }, ...prev].slice(0, 12));
  }, []);

  const recordConversion = useCallback((option, outcome = 'completed') => {
    setHistory((prev) => [
      {
        id: uid('hist'),
        date: 'Today',
        requiredGems: option.requiredGems,
        receiveVEs: option.receiveVEs,
        status: outcome,
        timestamp: Date.now(),
      },
      ...prev,
    ]);
    pushActivity({
      label: outcome === 'completed' ? 'Conversion completed' : 'Conversion failed',
      detail: `${option.requiredGems} Gems → ${option.receiveVEs} VEs`,
      tone: outcome === 'completed' ? 'success' : 'danger',
    });
    if (outcome === 'completed') {
      pushNotification({
        title: 'Conversion successful',
        body: `${option.requiredGems} Gems converted into ${option.receiveVEs} VEs.`,
        tone: 'success',
      });
    }
  }, [pushActivity, pushNotification]);

  // --- Earn Gems / "watch ad" daily limits --------------------------------
  // Each ad tier tracks its own watch count, plus a combined daily total.
  // Everything resets automatically 24 hours after the current window
  // started — including while the tab is open (checked on a timer) and
  // right after a refresh/relaunch (checked on mount below), so a capped
  // tier reopens on its own instead of staying stuck forever.
  const resetAdWindowIfExpired = useCallback(() => {
    setAdWindowStart((start) => {
      if (Date.now() - start >= ADS_WINDOW_MS) {
        setAdWatchCounts({});
        setAdsWatchedToday(0);
        return Date.now();
      }
      return start;
    });
  }, []);

  useEffect(() => {
    resetAdWindowIfExpired();
    const interval = setInterval(resetAdWindowIfExpired, 60 * 1000);
    // Also re-check whenever the tab regains focus/visibility, in case the
    // 24h window elapsed while the app was in the background.
    document.addEventListener('visibilitychange', resetAdWindowIfExpired);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', resetAdWindowIfExpired);
    };
  }, [resetAdWindowIfExpired]);

  const adResetAt = adWindowStart + ADS_WINDOW_MS;

  const recordAdWatch = useCallback((ad, gemsEarned) => {
    setAdWatchCounts((prev) => ({ ...prev, [ad.id]: (prev[ad.id] ?? 0) + 1 }));
    setAdsWatchedToday((prev) => prev + 1);
    pushActivity({ label: 'Ad reward collected', detail: `+${gemsEarned} Gems · ${ad.label}`, tone: 'gold' });
  }, [pushActivity]);

  const requestWithdrawal = useCallback((amountVEs, method) => {
    const entry = {
      id: uid('wd'),
      date: 'Today',
      amountVEs,
      method,
      status: 'processing',
      timestamp: Date.now(),
    };
    setWithdrawals((prev) => [entry, ...prev]);
    setBalance((prev) => ({ ...prev, ves: Math.max(0, prev.ves - amountVEs) }));
    pushNotification({
      title: 'Withdrawal requested',
      body: `${amountVEs.toLocaleString('en-IN')} VEs via ${method} is being processed.`,
      tone: 'gold',
    });
    // Simulate the backend confirming the payout shortly after.
    const settleAfter = 3200 + Math.random() * 1800;
    setTimeout(() => {
      setWithdrawals((prev) => prev.map((w) => (w.id === entry.id ? { ...w, status: 'completed' } : w)));
      pushNotification({
        title: 'Withdrawal completed',
        body: `${amountVEs.toLocaleString('en-IN')} VEs sent via ${method}.`,
        tone: 'success',
      });
      pushActivity({ label: 'Withdrawal completed', detail: `${amountVEs.toLocaleString('en-IN')} VEs · ${method}`, tone: 'success' });
    }, settleAfter);
    return entry;
  }, [pushActivity, pushNotification]);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // --- "Real-time" ambient simulation ------------------------------------
  const tickRef = useRef(0);
  useEffect(() => {
    const heartbeat = setInterval(() => {
      setConnection('syncing');
      setTimeout(() => setConnection('live'), 550);
    }, 26000);

    const microTick = setInterval(() => {
      tickRef.current += 1;
      // Occasionally simulate a passive micro-earning trickling in, purely
      // cosmetic — mirrors how a live socket feed would nudge the UI.
      if (tickRef.current % 3 === 0) {
        setBalance((prev) => ({ ...prev, ves: prev.ves + Math.floor(Math.random() * 2) }));
      }
    }, 9000);

    return () => {
      clearInterval(heartbeat);
      clearInterval(microTick);
    };
  }, []);

  const value = useMemo(() => ({
    balance,
    setBalance,
    profile,
    history,
    setHistory,
    withdrawals,
    notifications,
    activity,
    adsWatchedToday,
    adsDailyLimit,
    adWatchCounts,
    adResetAt,
    connection,
    todayEarnings,
    lifetimeEarnings,
    goalProgress,
    goalCompleted,
    dailyGoalTarget,
    recordConversion,
    recordAdWatch,
    requestWithdrawal,
    markAllNotificationsRead,
    clearAllNotifications,
    dismissNotification,
    pushNotification,
    pushActivity,
  }), [
    balance, profile, history, withdrawals, notifications, activity, adsWatchedToday,
    adsDailyLimit, adWatchCounts, adResetAt, connection, todayEarnings, lifetimeEarnings, goalProgress, goalCompleted,
    recordConversion, recordAdWatch, requestWithdrawal, markAllNotificationsRead,
    clearAllNotifications, dismissNotification, pushNotification, pushActivity,
  ]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}