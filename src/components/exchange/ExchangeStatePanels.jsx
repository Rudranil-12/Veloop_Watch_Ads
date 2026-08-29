import { Gift, RefreshCcw } from 'lucide-react';
import styles from './ExchangeStatePanels.module.css';

export function EmptyState() {
  return (
    <div className={styles.panel}>
      <div className={`${styles.icon} ${styles.emptyIcon}`}>
        <Gift size={22} />
      </div>
      <h3>No conversions available right now</h3>
      <p>New reward conversion opportunities will appear here when available.</p>
    </div>
  );
}

export function ErrorState({ onRetry }) {
  return (
    <div className={styles.panel}>
      <h3>Unable to load exchange options</h3>
      <p>Please try again.</p>
      <button type="button" className={styles.retryBtn} onClick={onRetry}>
        <RefreshCcw size={14} /> Retry
      </button>
    </div>
  );
}
