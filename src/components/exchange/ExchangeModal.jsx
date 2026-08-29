import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import VaultPortal from './VaultPortal';
import styles from './ExchangeModal.module.css';

/**
 * status: 'review' | 'insufficient' | 'processing' | 'success'
 */
export default function ExchangeModal({ option, balance, status, onConfirm, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    function onKey(e) {
      if (e.key === 'Escape' && status !== 'processing') onClose();
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, status]);

  if (!option) return null;
  const { requiredGems, receiveVEs } = option;
  const shortfall = requiredGems - balance.gems;
  const gemsAfter = balance.gems - requiredGems;
  const vesAfter = balance.ves + receiveVEs;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        role="presentation"
        onMouseDown={(e) => { if (e.target === e.currentTarget && status !== 'processing') onClose(); }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={styles.modal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="exchange-modal-title"
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ duration: 0.22 }}
        >
          {status !== 'processing' && (
            <button
              ref={closeRef}
              type="button"
              className={styles.closeBtn}
              aria-label="Close dialog"
              onClick={onClose}
            >
              <X size={16} />
            </button>
          )}

          {status === 'review' && (
            <>
              <h2 id="exchange-modal-title" className={styles.title}>Confirm Conversion</h2>
              <div className={styles.portalRow}>
                <VaultPortal size={72} spin={false} />
              </div>
              <div className={styles.rateRow}>
                <span className={`${styles.rateValue} num`}>{requiredGems} Gems</span>
                <span className={styles.rateSep}>↓</span>
                <span className={`${styles.rateValue} ${styles.gold} num`}>{receiveVEs} VEs</span>
              </div>
              <div className={styles.afterGrid}>
                <div>
                  <span className={styles.afterLabel}>Gems after conversion</span>
                  <span className={`${styles.afterValue} num`}>{gemsAfter.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className={styles.afterLabel}>VEs after conversion</span>
                  <span className={`${styles.afterValue} num`}>{vesAfter.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className={styles.actions}>
                <button type="button" className={styles.secondaryBtn} onClick={onClose}>Cancel</button>
                <button type="button" className={styles.primaryBtn} onClick={onConfirm}>
                  Confirm Conversion
                </button>
              </div>
            </>
          )}

          {status === 'insufficient' && (
            <>
              <h2 id="exchange-modal-title" className={styles.title}>Not Enough Gems Yet</h2>
              <div className={styles.warnIcon}><AlertTriangle size={26} /></div>
              <div className={styles.afterGrid}>
                <div>
                  <span className={styles.afterLabel}>Available Gems</span>
                  <span className={`${styles.afterValue} num`}>{balance.gems}</span>
                </div>
                <div>
                  <span className={styles.afterLabel}>Required</span>
                  <span className={`${styles.afterValue} num`}>{requiredGems} Gems</span>
                </div>
              </div>
              <p className={styles.helperText}>
                You need <strong className="num">{shortfall}</strong> more Gems to unlock this conversion.
              </p>
              <div className={styles.actions}>
                <button type="button" className={styles.primaryBtn} onClick={onClose}>
                  Earn More Gems
                </button>
              </div>
            </>
          )}

          {status === 'processing' && (
            <div className={styles.center}>
              <Loader2 size={30} className={styles.spinner} />
              <p className={styles.processingText}>Converting…</p>
              <p className={styles.helperText}>Please don’t close this window.</p>
            </div>
          )}

          {status === 'success' && (
            <div className={styles.center}>
              <CheckCircle2 size={40} className={styles.successIcon} />
              <h2 id="exchange-modal-title" className={styles.title}>Conversion Complete</h2>
              <p className={styles.helperText}>
                {requiredGems} Gems converted — <strong className="num">+{receiveVEs} VEs</strong> added to your balance.
              </p>
              <div className={styles.actions}>
                <button type="button" className={styles.primaryBtn} onClick={onClose}>Continue</button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
