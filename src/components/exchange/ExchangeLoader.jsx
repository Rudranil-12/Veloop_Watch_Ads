import VaultPortal from './VaultPortal';
import styles from './ExchangeLoader.module.css';

export default function ExchangeLoader() {
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <VaultPortal size={80} />
      <p>Preparing your reward conversions…</p>
    </div>
  );
}
