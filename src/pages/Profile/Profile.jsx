import { UserCircle2, Mail, Phone, Calendar, ShieldCheck, Gem, Coins, Trophy } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { useAppData } from '../../context/AppDataContext';
import styles from './Profile.module.css';

export default function Profile() {
  const { profile, balance, lifetimeEarnings } = useAppData();
  const initial = profile.name.trim().charAt(0).toUpperCase();

  const rows = [
    { icon: Mail, label: 'Email', value: profile.email },
    { icon: Phone, label: 'Phone', value: profile.phone },
    { icon: Calendar, label: 'Member since', value: profile.memberSince },
    { icon: ShieldCheck, label: 'KYC status', value: 'Verified', tone: 'success' },
  ];

  return (
    <div className="container">
      <PageHeader
        eyebrow="Live · Profile"
        icon={UserCircle2}
        title="Your profile"
        description="Everything about your VELOOP Rewards membership in one place."
      />

      <div className={styles.heroCard}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.avatarWrap}>
          <span className={styles.avatar}>{initial}</span>
          <span className={styles.levelBadge}><Trophy size={11} /> Lvl {profile.level}</span>
        </div>
        <div className={styles.heroText}>
          <h2>{profile.name}</h2>
          <span className={styles.handle}>{profile.handle}</span>
          <span className={styles.tier}>{profile.tier}</span>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.detailsCard}>
          <h3>Account details</h3>
          <ul>
            {rows.map((r) => (
              <li key={r.label}>
                <span className={styles.rowIcon}><r.icon size={15} /></span>
                <span className={styles.rowLabel}>{r.label}</span>
                <span className={r.tone === 'success' ? styles.rowValueSuccess : styles.rowValue}>{r.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.statsCard}>
          <h3>Balance summary</h3>
          <div className={styles.statTile}>
            <Gem size={16} className={styles.gemColor} />
            <div>
              <span>Gems</span>
              <strong className="num">{balance.gems.toLocaleString('en-IN')}</strong>
            </div>
          </div>
          <div className={styles.statTile}>
            <Coins size={16} className={styles.veColor} />
            <div>
              <span>VEs</span>
              <strong className="num">{balance.ves.toLocaleString('en-IN')}</strong>
            </div>
          </div>
          <div className={styles.statTile}>
            <Trophy size={16} className={styles.goldColor} />
            <div>
              <span>Lifetime earnings</span>
              <strong className="num">{lifetimeEarnings.toLocaleString('en-IN')} VEs</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
