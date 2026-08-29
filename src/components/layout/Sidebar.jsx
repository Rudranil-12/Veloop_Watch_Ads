import { NavLink } from 'react-router-dom';
import {
  LayoutGrid, ListChecks, Gift, Users, WalletMinimal, History, UserCircle2, LifeBuoy, X, Sparkles,
  Gem, Coins, Flame,
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { to: '/', label: 'Exchange Center', icon: LayoutGrid, end: true },
  { to: '/tasks', label: 'Tasks', icon: ListChecks },
  { to: '/offers', label: 'Offers', icon: Gift },
  { to: '/refer', label: 'Refer & Earn', icon: Users },
  { to: '/wallet', label: 'Wallet', icon: WalletMinimal },
  { to: '/withdraw-history', label: 'Withdraw History', icon: History },
  { to: '/profile', label: 'Profile', icon: UserCircle2 },
  { to: '/support', label: 'Support', icon: LifeBuoy },
];

export default function Sidebar({ open, onClose }) {
  const { balance, goalProgress, goalCompleted } = useAppData();

  return (
    <>
      <div
        className={`${styles.scrim} ${open ? styles.scrimVisible : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`} aria-label="Primary navigation">
        <div className={styles.head}>
          <span className={styles.brandMark}>
            <span className={styles.brandGlyph}>V</span>
            <span className={styles.brandText}>
              VELOOP
              <em>Rewards</em>
            </span>
          </span>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
              onClick={onClose}
            >
              <span className={styles.linkIcon}><Icon size={17} strokeWidth={2} /></span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.quickStats}>
          <span className={styles.quickStatsLabel}>Quick balance</span>
          <div className={styles.quickStatsRow}>
            <span className={styles.quickStatChip}>
              <Gem size={13} className={styles.quickGem} />
              <span className="num">{balance.gems.toLocaleString('en-IN')}</span>
            </span>
            <span className={styles.quickStatChip}>
              <Coins size={13} className={styles.quickVe} />
              <span className="num">{balance.ves.toLocaleString('en-IN')}</span>
            </span>
          </div>
          <div className={styles.quickGoal}>
            <div className={styles.quickGoalTrack}>
              <div
                className={goalCompleted ? styles.quickGoalFillDone : styles.quickGoalFill}
                style={{ width: `${Math.min(100, goalProgress)}%` }}
              />
            </div>
            <span className={styles.quickGoalLabel}>
              <Flame size={12} /> {goalCompleted ? "Today's goal complete" : `${goalProgress}% of daily goal`}
            </span>
          </div>
        </div>

        <div className={styles.promo}>
          <span className={styles.promoIcon}><Sparkles size={16} /></span>
          <div>
            <strong>Level up faster</strong>
            <p>Complete daily tasks to unlock bigger conversion tiers.</p>
          </div>
        </div>
      </aside>
    </>
  );
}
