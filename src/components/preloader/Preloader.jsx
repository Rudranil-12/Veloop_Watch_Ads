import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Preloader.module.css';

const MESSAGES = [
  'Waking up the vault…',
  'Counting your Gems…',
  'Syncing VE balance…',
  'Polishing the dashboard…',
];

// A unique, brand-native preloader: a rotating "gem" mark assembles itself
// out of orbiting shards while a progress ring fills, then the whole scene
// dissolves upward to reveal the app. No third-party spinner — everything
// here is bespoke SVG + CSS driven by the tokens.css palette.
export default function Preloader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    const start = performance.now();
    const duration = 2200;
    let frame;

    const tick = (now) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        frame = requestAnimationFrame(tick);
      } else if (!doneRef.current) {
        doneRef.current = true;
        setExiting(true);
        setTimeout(() => onDone?.(), 620);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onDone]);

  useEffect(() => {
    const id = setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length);
    }, 620);
    return () => clearInterval(id);
  }, []);

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          className={styles.overlay}
          key="preloader"
          exit={{ opacity: 0, y: -40, transition: { duration: 0.6, ease: [0.6, 0, 0.2, 1] } }}
        >
          <div className={styles.aurora} aria-hidden="true" />

          <div className={styles.stage}>
            <div className={styles.markWrap}>
              <svg className={styles.ring} viewBox="0 0 120 120" aria-hidden="true">
                <circle className={styles.ringTrack} cx="60" cy="60" r="54" />
                <circle
                  className={styles.ringFill}
                  cx="60"
                  cy="60"
                  r="54"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                />
              </svg>

              <div className={styles.shardOrbit}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className={styles.shard} style={{ '--i': i }} />
                ))}
              </div>

              <div className={styles.core}>
                <svg viewBox="0 0 32 32" className={styles.coreMark} aria-hidden="true">
                  <path d="M16 2 L28 11 L23 30 L9 30 L4 11 Z" />
                </svg>
              </div>

              <span className={styles.progressNum}>{progress}%</span>
            </div>

            <div className={styles.wordmark}>
              VE<span>LOOP</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                className={styles.message}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                {MESSAGES[messageIndex]}
              </motion.p>
            </AnimatePresence>

            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{ width: `${progress}%` }} />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
