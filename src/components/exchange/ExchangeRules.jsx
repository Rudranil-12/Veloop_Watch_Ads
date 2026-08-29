import { ShieldCheck } from 'lucide-react';
import { exchangeRules } from '../../data/exchangeData';
import styles from './ExchangeRules.module.css';

export default function ExchangeRules() {
  return (
    <section className={styles.wrap} aria-labelledby="rules-heading">
      <div className={styles.headingRow}>
        <ShieldCheck size={18} className={styles.icon} />
        <h2 id="rules-heading">Exchange Rules</h2>
      </div>
      <ul className={styles.list}>
        {exchangeRules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
    </section>
  );
}
