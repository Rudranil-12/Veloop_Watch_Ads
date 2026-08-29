import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, Gem } from 'lucide-react';
import styles from './AdWatchModal.module.css';

const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Phases: 'loading' -> 'playing' -> 'reward'
export default function AdWatchModal({ ad, onComplete, onClose }) {
  const [phase, setPhase] = useState('loading');
  const [remaining, setRemaining] = useState(ad.durationSeconds);
  const closeRef = useRef(null);
  const canDismiss = phase === 'reward';

  useEffect(() => {
    if (phase !== 'loading') return undefined;
    const t = setTimeout(() => setPhase('playing'), 650);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing') return undefined;
    if (remaining <= 0) {
      setPhase('reward');
      return undefined;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, remaining]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && canDismiss) onClose();
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [canDismiss, onClose]);

  useEffect(() => {
    if (phase === 'reward') closeRef.current?.focus();
  }, [phase]);

  const elapsed = ad.durationSeconds - remaining;
  const progress = elapsed / ad.durationSeconds;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const particles = Array.from({ length: 10 });

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        role="presentation"
        onMouseDown={(e) => { if (canDismiss && e.target === e.currentTarget) onClose(); }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={styles.modal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ad-modal-title"
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ duration: 0.22 }}
        >
          {canDismiss && (
            <button
              ref={closeRef}
              type="button"
              className={styles.closeBtn}
              aria-label="Close"
              onClick={onClose}
            >
              <X size={16} />
            </button>
          )}

          {phase === 'loading' && (
            <div className={styles.center}>
              <div className={styles.pulseDot} />
              <p className={styles.helper}>Preparing your ad…</p>
            </div>
          )}

          {phase === 'playing' && (
            <div className={styles.playing}>
              <div className={styles.adFrame}>
                <span className={styles.adTag}>
                  <Volume2 size={12} /> Ad · VELOOP Partner
                </span>
                <div className={styles.adShimmer} />
              </div>

              <div className={styles.ringWrap}>
                <svg viewBox="0 0 100 100" width="100" height="100">
                  <circle cx="50" cy="50" r={RADIUS} className={styles.ringTrack} />
                  <motion.circle
                    cx="50" cy="50" r={RADIUS}
                    className={styles.ringProgress}
                    strokeDasharray={CIRCUMFERENCE}
                    animate={{ strokeDashoffset: dashOffset }}
                    transition={{ duration: 1, ease: 'linear' }}
                  />
                </svg>
                <span className={`${styles.ringNumber} num`}>{remaining}</span>
              </div>
              <p className={styles.helper}>Please wait for the ad to finish to earn your Gems.</p>
            </div>
          )}

          {phase === 'reward' && (
            <div className={styles.center}>
              <div className={styles.burstWrap}>
                {particles.map((_, i) => {
                  const angle = (i / particles.length) * 2 * Math.PI;
                  const dist = 46 + (i % 3) * 8;
                  return (
                    <motion.span
                      key={i}
                      className={styles.particle}
                      initial={{ opacity: 1, x: 0, y: 0, scale: 0.6 }}
                      animate={{
                        opacity: 0,
                        x: Math.cos(angle) * dist,
                        y: Math.sin(angle) * dist - 10,
                        scale: 1,
                      }}
                      transition={{ duration: 0.9, delay: i * 0.02, ease: 'easeOut' }}
                    >
                      <Gem size={14} />
                    </motion.span>
                  );
                })}
                <motion.div
                  className={styles.gemBadge}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 16 }}
                >
                  <Gem size={26} />
                </motion.div>
              </div>

              <h2 id="ad-modal-title" className={styles.title}>Ad Complete</h2>
              <motion.p
                className={`${styles.rewardValue} num`}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 14 }}
              >
                +{ad.gems} Gems
              </motion.p>
              <p className={styles.helper}>Added to your balance.</p>

              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => onComplete(ad.gems)}
              >
                Collect Gems
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
