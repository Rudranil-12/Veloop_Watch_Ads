import { motion } from 'framer-motion';
import styles from './PageHeader.module.css';

export default function PageHeader({ eyebrow, title, description, icon: Icon, actions }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.text}>
        {eyebrow && (
          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {Icon && <Icon size={13} />} {eyebrow}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            {description}
          </motion.p>
        )}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
