import { motion } from 'framer-motion';
import { PlayCircle, ArrowRight, Lock } from 'lucide-react';
import VaultPortal from './VaultPortal';
import styles from './ExchangeCard.module.css';

export default function ExchangeCard({ option, userGems, onSelect }) {
  const { label, description, requiredGems, receiveVEs, watchAd, available } = option;
  const canAfford = userGems >= requiredGems;
  const disabled = !available;

  return (
    <motion.article
      className={`${styles.card} ${disabled ? styles.disabled : ''}`}
      whileHover={disabled ? {} : { y: -4 }}
      transition={{ duration: 0.18 }}
    >
      <div className={styles.top}>
        <VaultPortal size={56} spin={false} />
        <div className={styles.heading}>
          <h3>{label}</h3>
          <p>{description}</p>
        </div>
      </div>

      <div className={styles.rate}>
        <div className={styles.rateSide}>
          <span className={styles.rateLabel}>Required Gems</span>
          <span className={`${styles.rateValue} num`}>{requiredGems}</span>
        </div>
        <ArrowRight size={18} className={styles.rateArrow} aria-hidden="true" />
        <div className={styles.rateSide}>
          <span className={styles.rateLabel}>You receive</span>
          <span className={`${styles.rateValue} ${styles.gold} num`}>{receiveVEs} VEs</span>
        </div>
      </div>

      <div className={styles.footer}>
        {watchAd && !disabled && (
          <span className={styles.adTag}>
            <PlayCircle size={13} /> Watch a short ad to unlock
          </span>
        )}
        {disabled ? (
          <span className={styles.lockedTag}>
            <Lock size={13} /> Not currently available
          </span>
        ) : (
          <button
            type="button"
            className={canAfford ? styles.cta : styles.ctaSecondary}
            onClick={() => onSelect(option)}
          >
            {canAfford ? 'Convert Rewards' : 'Earn More Gems'}
          </button>
        )}
      </div>
    </motion.article>
  );
}
