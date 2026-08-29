import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import styles from './InfoTip.module.css';

export default function InfoTip({ label, text }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <span className={styles.wrap} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        aria-label={`More information about ${label}`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <Info size={13} strokeWidth={2.4} />
      </button>
      {open && (
        <span role="tooltip" className={styles.bubble}>
          {text}
        </span>
      )}
    </span>
  );
}
