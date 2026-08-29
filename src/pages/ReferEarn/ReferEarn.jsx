import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Copy, Check, Share2, Gem, UserPlus } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { useAppData } from '../../context/AppDataContext';
import styles from './ReferEarn.module.css';

const REFERRALS = [
  { id: 'r1', name: 'Ananya S.', status: 'joined', reward: 40, when: 'Yesterday' },
  { id: 'r2', name: 'Kabir T.', status: 'pending', reward: 40, when: '2 days ago' },
  { id: 'r3', name: 'Meher J.', status: 'joined', reward: 40, when: '5 days ago' },
];

export default function ReferEarn() {
  const { profile } = useAppData();
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://veloop.rewards/join?ref=${profile.referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Clipboard access may be blocked in some embedded contexts — fail silently.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const joinedCount = REFERRALS.filter((r) => r.status === 'joined').length;
  const totalEarned = REFERRALS.filter((r) => r.status === 'joined').reduce((s, r) => s + r.reward, 0);

  return (
    <div className="container">
      <PageHeader
        eyebrow="Live · Refer & Earn"
        icon={Users}
        title="Invite friends, earn Gems together"
        description="Share your referral code. When a friend joins and completes their first task, you both get a Gem bonus."
      />

      <div className={styles.codeCard}>
        <div className={styles.codeGlow} aria-hidden="true" />
        <div className={styles.codeLeft}>
          <span className={styles.codeLabel}>Your referral code</span>
          <span className={styles.code}>{profile.referralCode}</span>
          <span className={styles.link}>{shareUrl}</span>
        </div>
        <div className={styles.codeActions}>
          <button type="button" className={styles.copyBtn} onClick={handleCopy}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Copied' : 'Copy link'}
          </button>
          <button type="button" className={styles.shareBtn}>
            <Share2 size={15} /> Share
          </button>
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Friends joined</span>
          <span className={styles.statValue}>{joinedCount}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Gems earned from referrals</span>
          <span className={styles.statValue}><Gem size={16} /> {totalEarned}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Reward per referral</span>
          <span className={styles.statValue}>+40 Gems</span>
        </div>
      </div>

      <section className={styles.feedWrap}>
        <h2>Referral activity</h2>
        <ul className={styles.feed}>
          {REFERRALS.map((r, i) => (
            <motion.li
              key={r.id}
              className={styles.feedRow}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <span className={styles.feedAvatar}>{r.name.charAt(0)}</span>
              <div className={styles.feedBody}>
                <p>
                  <strong>{r.name}</strong>
                  {r.status === 'joined' ? ' joined using your code' : ' signed up — waiting on first task'}
                </p>
                <span className={styles.feedTime}>{r.when}</span>
              </div>
              <span className={`${styles.feedStatus} ${r.status === 'joined' ? styles.statusJoined : styles.statusPending}`}>
                {r.status === 'joined' ? <><Check size={12} /> +{r.reward} Gems</> : <><UserPlus size={12} /> Pending</>}
              </span>
            </motion.li>
          ))}
        </ul>
      </section>
    </div>
  );
}
