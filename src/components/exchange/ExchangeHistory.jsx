import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Clock, XCircle, Radio } from 'lucide-react';
import { timeAgo } from '../../utils/time';
import styles from './ExchangeHistory.module.css';

const statusMeta = {
  completed: { label: 'Completed', icon: CheckCircle2, className: 'success' },
  pending: { label: 'Processing', icon: Clock, className: 'pending' },
  failed: { label: 'Failed', icon: XCircle, className: 'failed' },
};

export default function ExchangeHistory({ items }) {
  // Re-render every 30s purely to keep "x minutes ago" labels fresh.
  const [, forceTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => forceTick((n) => n + 1), 30000);
    return () => clearInterval(id);
  }, []);

  if (!items?.length) return null;

  return (
    <section className={styles.wrap} aria-labelledby="history-heading">
      <div className={styles.headRow}>
        <h2 id="history-heading" className={styles.heading}>Recent Conversions</h2>
        <span className={styles.liveTag}>
          <Radio size={11} /> Live
        </span>
      </div>

      <ul className={styles.list}>
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const meta = statusMeta[item.status] ?? statusMeta.completed;
            const Icon = meta.icon;
            const dateLabel = item.timestamp ? timeAgo(item.timestamp) : item.date;
            return (
              <motion.li
                key={item.id}
                className={styles.row}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className={styles.date}>{dateLabel}</span>
                <span className={`${styles.amounts} num`}>
                  {item.requiredGems} Gems → {item.receiveVEs} VEs
                </span>
                <span className={`${styles.status} ${styles[meta.className]}`}>
                  <Icon size={13} /> {meta.label}
                </span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </section>
  );
}
