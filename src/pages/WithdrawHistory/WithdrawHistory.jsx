import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, CheckCircle2, Clock, XCircle, Radio } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { useAppData } from '../../context/AppDataContext';
import { timeAgo } from '../../utils/time';
import styles from './WithdrawHistory.module.css';

const FILTERS = ['All', 'Processing', 'Completed', 'Failed'];

const statusMeta = {
  processing: { label: 'Processing', icon: Clock, className: 'pending' },
  completed: { label: 'Completed', icon: CheckCircle2, className: 'success' },
  failed: { label: 'Failed', icon: XCircle, className: 'failed' },
};

export default function WithdrawHistory() {
  const { withdrawals } = useAppData();
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    if (filter === 'All') return withdrawals;
    return withdrawals.filter((w) => statusMeta[w.status]?.label === filter);
  }, [withdrawals, filter]);

  const totalWithdrawn = withdrawals
    .filter((w) => w.status === 'completed')
    .reduce((sum, w) => sum + w.amountVEs, 0);

  return (
    <div className="container">
      <PageHeader
        eyebrow="Live · Withdraw History"
        icon={History}
        title="Your withdrawal activity"
        description="Every payout request, tracked in real time from processing to completion."
        actions={<span className={styles.totalTag}>{totalWithdrawn.toLocaleString('en-IN')} VEs withdrawn</span>}
      />

      <div className={styles.filters}>
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
        <span className={styles.liveTag}><Radio size={11} /> Live</span>
      </div>

      <div className={styles.tableWrap}>
        <div className={styles.tableHead}>
          <span>Amount</span>
          <span>Method</span>
          <span>When</span>
          <span>Status</span>
        </div>
        <ul className={styles.list}>
          <AnimatePresence initial={false}>
            {filtered.map((w) => {
              const meta = statusMeta[w.status] ?? statusMeta.completed;
              const Icon = meta.icon;
              return (
                <motion.li
                  key={w.id}
                  className={styles.row}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <span className={`${styles.amount} num`}>{w.amountVEs.toLocaleString('en-IN')} VEs</span>
                  <span className={styles.method}>{w.method}</span>
                  <span className={styles.when}>{w.timestamp ? timeAgo(w.timestamp) : w.date}</span>
                  <span className={`${styles.status} ${styles[meta.className]}`}>
                    <Icon size={13} /> {meta.label}
                  </span>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
        {filtered.length === 0 && (
          <div className={styles.empty}>No withdrawals in this category yet.</div>
        )}
      </div>
    </div>
  );
}
