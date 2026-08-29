import { motion, AnimatePresence } from 'framer-motion';
import { Gem, Coins } from 'lucide-react';
import InfoTip from './InfoTip';
import { infoTooltips } from '../../data/exchangeData';
import styles from './BalanceOverview.module.css';

export default function BalanceOverview({ gems, ves }) {
  return (
    <section className={styles.wrap} aria-label="Your reward balances">
      <div className={styles.card}>
        <div className={`${styles.iconChip} ${styles.gemChip}`}>
          <Gem size={20} strokeWidth={2} />
        </div>
        <div className={styles.body}>
          <span className={styles.label}>
            Available Gems
            <InfoTip label="Gems" text={infoTooltips.gems} />
          </span>
          <AnimatePresence mode="popLayout">
            <motion.span
              key={gems}
              className={`${styles.value} num`}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {gems.toLocaleString('en-IN')}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <div className={styles.divider} aria-hidden="true" />

      <div className={styles.card}>
        <div className={`${styles.iconChip} ${styles.veChip}`}>
          <Coins size={20} strokeWidth={2} />
        </div>
        <div className={styles.body}>
          <span className={styles.label}>
            Available VEs
            <InfoTip label="VEs" text={infoTooltips.ves} />
          </span>
          <span className={`${styles.value} num`}>{ves.toLocaleString('en-IN')} VEs</span>
        </div>
      </div>
    </section>
  );
}
