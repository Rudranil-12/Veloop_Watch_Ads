import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Gift, PartyPopper } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import styles from './DailyGoalCard.module.css';

const STREAK_DAYS = 12;

export default function DailyGoalCard() {
  const { todayEarnings, dailyGoalTarget, goalProgress, goalCompleted, pushNotification } = useAppData();
  const [claimed, setClaimed] = useState(false);

  const circumference = 2 * Math.PI * 58;
  const offset = circumference - (Math.min(100, goalProgress) / 100) * circumference;

  const sparkles = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    id: i,
    angle: (360 / 10) * i,
    delay: i * 0.05,
  })), []);

  const handleClaim = () => {
    setClaimed(true);
    pushNotification({ title: 'Streak bonus claimed', body: `Day ${STREAK_DAYS} reward added to your Gems.`, tone: 'gold' });
  };

  return (
    <section className={styles.wrap} aria-labelledby="daily-goal-heading">
      <div className={styles.glowLeft} aria-hidden="true" />
      <div className={styles.glowRight} aria-hidden="true" />

      <div className={styles.ringZone}>
        <svg viewBox="0 0 140 140" className={styles.ring} aria-hidden="true">
          <circle cx="70" cy="70" r="58" className={styles.ringTrack} />
          <circle
            cx="70" cy="70" r="58"
            className={goalCompleted ? styles.ringFillDone : styles.ringFill}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>

        <AnimatePresence>
          {goalCompleted && sparkles.map((s) => (
            <motion.span
              key={s.id}
              className={styles.sparkle}
              style={{ '--angle': `${s.angle}deg` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: s.delay }}
            />
          ))}
        </AnimatePresence>

        <div className={styles.ringCenter}>
          {goalCompleted ? <PartyPopper size={22} className={styles.doneIcon} /> : <span className={styles.pct}>{goalProgress}%</span>}
        </div>
      </div>

      <div className={styles.body}>
        <span className={styles.tag}>
          {goalCompleted ? 'Daily goal completed' : 'Daily goal in progress'}
        </span>
        <h2 id="daily-goal-heading">
          {goalCompleted ? "You've earned today's reward." : `${dailyGoalTarget - todayEarnings} VEs left to hit today's goal.`}
        </h2>
        <p>
          {goalCompleted
            ? 'Amazing work! Come back tomorrow to keep your streak going.'
            : 'Convert Gems or watch a reward ad to close the gap before the day resets.'}
        </p>

        <div className={styles.metaRow}>
          <span className={`${styles.metaChip} num`}>
            {Math.min(todayEarnings, dailyGoalTarget).toLocaleString('en-IN')} / {dailyGoalTarget} VEs
          </span>
          <span className={styles.streak}>
            <Flame size={14} /> {STREAK_DAYS}-day streak
          </span>
        </div>

        {goalCompleted && (
          <button
            type="button"
            className={claimed ? styles.claimedBtn : styles.claimBtn}
            onClick={handleClaim}
            disabled={claimed}
          >
            <Gift size={14} /> {claimed ? 'Streak bonus claimed' : 'Claim streak bonus'}
          </button>
        )}
      </div>
    </section>
  );
}
