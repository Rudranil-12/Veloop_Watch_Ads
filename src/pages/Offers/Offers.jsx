import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Flame, Clock3, Gauge, Gem } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { offersData } from '../../data/exchangeData';
import { useAppData } from '../../context/AppDataContext';
import styles from './Offers.module.css';

const CATEGORIES = ['All', 'Games', 'Shopping', 'Health', 'Entertainment', 'Finance'];

export default function Offers() {
  const { setBalance, pushActivity, pushNotification } = useAppData();
  const [category, setCategory] = useState('All');
  const [startedIds, setStartedIds] = useState([]);

  const filtered = useMemo(
    () => (category === 'All' ? offersData : offersData.filter((o) => o.category === category)),
    [category],
  );

  const handleStart = (offer) => {
    if (startedIds.includes(offer.id)) return;
    setStartedIds((prev) => [...prev, offer.id]);
    pushNotification({ title: 'Offer started', body: `${offer.title} — complete it to earn +${offer.payout} Gems.`, tone: 'violet' });

    // Simulate the partner network confirming completion shortly after.
    setTimeout(() => {
      setBalance((prev) => ({ ...prev, gems: prev.gems + offer.payout }));
      pushActivity({ label: 'Offer completed', detail: `+${offer.payout} Gems · ${offer.brand}`, tone: 'gold' });
      pushNotification({ title: 'Offer completed', body: `${offer.title} confirmed — +${offer.payout} Gems credited.`, tone: 'success' });
    }, 4200);
  };

  return (
    <div className="container">
      <PageHeader
        eyebrow="Live · Offers"
        icon={Gift}
        title="Earn bigger rewards with partner offers"
        description="Complete offers from our partners to earn a larger batch of Gems. Rewards are credited automatically once confirmed."
      />

      <div className={styles.filters}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`${styles.filterBtn} ${category === c ? styles.filterActive : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((offer, i) => {
          const started = startedIds.includes(offer.id);
          return (
            <motion.article
              key={offer.id}
              className={styles.card}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              {offer.trending && (
                <span className={styles.trending}><Flame size={11} /> Trending</span>
              )}
              <span className={styles.brand}>{offer.brand}</span>
              <h3>{offer.title}</h3>

              <div className={styles.metaRow}>
                <span><Clock3 size={12} /> {offer.time}</span>
                <span><Gauge size={12} /> {offer.difficulty}</span>
              </div>

              <div className={styles.footer}>
                <span className={styles.payout}><Gem size={13} /> +{offer.payout} {offer.unit}</span>
                <button
                  type="button"
                  className={started ? styles.pendingBtn : styles.startBtn}
                  onClick={() => handleStart(offer)}
                  disabled={started}
                >
                  {started ? 'In progress…' : 'Start offer'}
                </button>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
