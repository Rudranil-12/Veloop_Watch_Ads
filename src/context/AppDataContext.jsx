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

// ---------------------------------------------------------------------------
// AppDataContext
// A single, lightweight "live" data layer shared by every page (Topbar,
// Sidebar, Dashboard, Wallet, Withdraw History, Profile...). It simulates a
// real-time backend: balances tick, notifications arrive, and every
// conversion/ad-watch/withdrawal is appended to shared history so the whole
// app stays in sync — the same way a real socket/polling layer would.
// Swap the setInterval simulations for real subscriptions when the backend
// is ready; component-facing shapes are designed to stay identical.
// ---------------------------------------------------------------------------

const AppDataContext = createContext(null);

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function AppDataProvider({ children }) {
  const [balance, setBalance] = useState(userBalance);
  const [profile] = useState(userProfile);
  const [history, setHistory] = useState(conversionHistory);
  const [withdrawals, setWithdrawals] = useState(withdrawHistorySeed);
  const [notifications, setNotifications] = useState(notificationsSeed);
  const [activity, setActivity] = useState(liveActivityFeed);
  const [adsWatchedToday, setAdsWatchedToday] = useState(5);
  const [adsDailyLimit] = useState(6);
  const [connection, setConnection] = useState('live'); // live | syncing

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

  const recordAdWatch = useCallback((gemsEarned, adLabel) => {
    setAdsWatchedToday((prev) => Math.min(adsDailyLimit, prev + 1));
    pushActivity({ label: 'Ad reward collected', detail: `+${gemsEarned} Gems · ${adLabel}`, tone: 'gold' });
  }, [adsDailyLimit, pushActivity]);

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
    adsDailyLimit, connection, todayEarnings, lifetimeEarnings, goalProgress, goalCompleted,
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
