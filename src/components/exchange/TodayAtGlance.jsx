import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Coins, PlayCircle, Timer, Activity } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import styles from './TodayAtGlance.module.css';

function useCountUp(value, duration = 700) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const from = display;
    const delta = value - from;
    if (delta === 0) return undefined;
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setDisplay(Math.round(from + delta * eased));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return display;
}

export default function TodayAtGlance() {
  const { todayEarnings, lifetimeEarnings, adsWatchedToday, adsDailyLimit, goalProgress, dailyGoalTarget } = useAppData();

  const today = useCountUp(todayEarnings);
  const lifetime = useCountUp(lifetimeEarnings);
  const remainingAds = Math.max(0, adsDailyLimit - adsWatchedToday);

  const stats = [
    {
      id: 'today',
      label: "Today's Earnings",
      value: `${today.toLocaleString('en-IN')}`,
      unit: 'VEs',
      icon: TrendingUp,
      tone: 'violet',
      hint: '+18.4% vs yesterday',
    },
    {
      id: 'lifetime',
      label: 'Lifetime Earnings',
      value: lifetime.toLocaleString('en-IN'),
      unit: 'VEs',
      icon: Coins,
      tone: 'gold',
      hint: 'All-time total',
    },
    {
      id: 'ads',
      label: 'Ads Watched Today',
      value: adsWatchedToday,
      unit: `/ ${adsDailyLimit}`,
      icon: PlayCircle,
      tone: 'blue',
      hint: `${Math.round((adsWatchedToday / adsDailyLimit) * 100)}% of daily cap`,
    },
    {
      id: 'remaining',
      label: 'Remaining Ads',
      value: remainingAds,
      unit: 'left',
      icon: Timer,
      tone: 'success',
      hint: remainingAds === 0 ? 'All caught up' : 'Still available today',
    },
  ];

  return (
    <section className={styles.wrap} aria-labelledby="glance-heading">
      <div className={styles.headRow}>
        <div>
          <span className={styles.eyebrow}>
            <Activity size={12} /> Live · Today at a glance
          </span>
          <h2 id="glance-heading">Your earning snapshot</h2>
        </div>
        <span className={styles.updated}>Updated just now</span>
      </div>

      <div className={styles.grid}>
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.article
              key={s.id}
              className={`${styles.tile} ${styles[`tone-${s.tone}`]}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <span className={styles.tileIcon}><Icon size={16} /></span>
              <span className={styles.tileLabel}>{s.label}</span>
              <span className={`${styles.tileValue} num`}>
                {s.value}<em>{s.unit}</em>
              </span>
              <span className={styles.tileHint}>{s.hint}</span>
            </motion.article>
          );
        })}
      </div>

      <div className={styles.goalTrail}>
        <div className={styles.goalTrailHead}>
          <span>Daily goal trail</span>
          <span className="num">{Math.min(today, dailyGoalTarget).toLocaleString('en-IN')} / {dailyGoalTarget} VEs</span>
        </div>
        <div className={styles.segments}>
          {Array.from({ length: 24 }).map((_, i) => {
            const filled = (i / 24) * 100 < goalProgress;
            return <span key={i} className={`${styles.segment} ${filled ? styles.segmentOn : ''}`} style={{ '--d': `${i * 12}ms` }} />;
          })}
        </div>
      </div>
    </section>
  );
}
