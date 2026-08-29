import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, Search, Bell, Gem, Coins, ChevronDown, LogOut, Settings, UserCircle2, Wifi,
  Sun, Moon, CheckCheck, Trash2, BellOff,
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './Topbar.module.css';

export default function Topbar({ onMenuClick }) {
  const {
    balance, profile, notifications, connection,
    markAllNotificationsRead, clearAllNotifications, dismissNotification,
  } = useAppData();
  const { theme, toggleTheme } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unread = notifications.filter((n) => !n.read).length;
  const initial = profile.name.trim().charAt(0).toUpperCase();

  useEffect(() => {
    function onDocClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const openNotifications = () => {
    setNotifOpen((v) => !v);
    setProfileOpen(false);
  };

  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        <button type="button" className={styles.menuBtn} onClick={onMenuClick} aria-label="Open menu">
          <Menu size={19} />
        </button>

        <label className={styles.search}>
          <Search size={15} />
          <input
            type="text"
            placeholder="Search ads, offers, tasks…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd>⌘K</kbd>
        </label>
      </div>

      <div className={styles.right}>
        <span className={`${styles.statusPill} ${connection === 'live' ? styles.statusLive : styles.statusSync}`}>
          <Wifi size={12} />
          {connection === 'live' ? 'Live' : 'Syncing'}
        </span>

        <div className={styles.balanceStrip}>
          <span className={styles.balanceChip}>
            <Gem size={13} className={styles.gemIcon} />
            <AnimatePresence mode="popLayout">
              <motion.span
                key={balance.gems}
                initial={{ y: -6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 6, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="num"
              >
                {balance.gems.toLocaleString('en-IN')}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className={styles.balanceChip}>
            <Coins size={13} className={styles.veIcon} />
            <AnimatePresence mode="popLayout">
              <motion.span
                key={balance.ves}
                initial={{ y: -6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 6, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="num"
              >
                {balance.ves.toLocaleString('en-IN')}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>

        <button
          type="button"
          className={styles.iconBtn}
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className={styles.themeIcon}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </motion.span>
          </AnimatePresence>
        </button>

        <div className={styles.notifWrap} ref={notifRef}>
          <button type="button" className={styles.iconBtn} onClick={openNotifications} aria-label="Notifications">
            <Bell size={17} />
            {unread > 0 && <span className={styles.badge}>{unread}</span>}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                className={styles.dropdown}
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.16 }}
              >
                <div className={styles.dropdownHead}>
                  <span>Notifications{unread > 0 ? ` (${unread})` : ''}</span>
                  <div className={styles.dropdownActions}>
                    <button
                      type="button"
                      className={styles.dropdownAction}
                      onClick={markAllNotificationsRead}
                      disabled={notifications.length === 0 || unread === 0}
                    >
                      <CheckCheck size={13} /> Mark all read
                    </button>
                    <button
                      type="button"
                      className={styles.dropdownAction}
                      onClick={clearAllNotifications}
                      disabled={notifications.length === 0}
                    >
                      <Trash2 size={13} /> Clear all
                    </button>
                  </div>
                </div>
                <div className={styles.dropdownList}>
                  {notifications.length === 0 && (
                    <div className={styles.emptyNotifWrap}>
                      <BellOff size={22} />
                      <p className={styles.emptyNotif}>You&rsquo;re all caught up.</p>
                    </div>
                  )}
                  <AnimatePresence initial={false}>
                    {notifications.map((n) => (
                      <motion.div
                        key={n.id}
                        className={`${styles.notifRow} ${n.read ? '' : styles.notifUnread}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        <span className={`${styles.notifDot} ${styles[`tone-${n.tone}`]}`} />
                        <div className={styles.notifBodyWrap}>
                          <p className={styles.notifTitle}>{n.title}</p>
                          <p className={styles.notifBody}>{n.body}</p>
                          <span className={styles.notifTime}>{n.time}</span>
                        </div>
                        <button
                          type="button"
                          className={styles.notifDismiss}
                          aria-label="Dismiss notification"
                          onClick={() => dismissNotification(n.id)}
                        >
                          ×
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={styles.profileWrap} ref={profileRef}>
          <button
            type="button"
            className={styles.profileBtn}
            onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
          >
            <span className={styles.avatar}>{initial}</span>
            <span className={styles.profileText}>
              <strong>{profile.name}</strong>
              <em>{profile.tier}</em>
            </span>
            <ChevronDown size={14} className={styles.chevron} />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                className={styles.profileMenu}
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.16 }}
              >
                <Link to="/profile" className={styles.menuItem} onClick={() => setProfileOpen(false)}>
                  <UserCircle2 size={15} /> View profile
                </Link>
                <Link to="/support" className={styles.menuItem} onClick={() => setProfileOpen(false)}>
                  <Settings size={15} /> Support &amp; settings
                </Link>
                <button type="button" className={`${styles.menuItem} ${styles.menuDanger}`}>
                  <LogOut size={15} /> Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
