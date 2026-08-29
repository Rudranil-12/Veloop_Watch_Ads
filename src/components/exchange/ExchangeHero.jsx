import { motion } from 'framer-motion';
import VaultPortal from './VaultPortal';
import styles from './ExchangeHero.module.css';

export default function ExchangeHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.text}>
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.eyebrow}
        >
          Exchange Center
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          Turn your earned Gems into VEs
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className={styles.sub}
        >
          Convert your eligible Gems into VEs and continue your reward journey.
          Every conversion follows a fixed, transparent rate — no market, no guessing.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={styles.visual}
      >
        <VaultPortal size={168} />
      </motion.div>
    </section>
  );
}
