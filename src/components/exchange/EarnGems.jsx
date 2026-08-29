import { Link } from 'react-router-dom';
import { PlayCircle, Gem, Sparkles, ArrowRight } from 'lucide-react';
import InfoTip from './InfoTip';
import { infoTooltips, gemEarnActions } from '../../data/exchangeData';
import styles from './EarnGems.module.css';

export default function EarnGems({ ads, watchCounts, onWatch }) {
  return (
    <section className={styles.wrap} aria-labelledby="earn-gems-heading">
      <div className={styles.sectionHead}>
        <h2 id="earn-gems-heading">
          Earn Gems
          <InfoTip label="earning Gems" text={infoTooltips.earnGems} />
        </h2>
        <p>Watch a short ad to top up your Gems, then convert them into VEs below.</p>
      </div>

      <div className={styles.grid}>
        {ads.map((ad) => {
          const watched = watchCounts[ad.id] ?? 0;
          const remaining = ad.dailyLimit - watched;
          const capped = remaining <= 0;
          const progressPct = Math.min(100, (watched / ad.dailyLimit) * 100);

          return (
            <article key={ad.id} className={`${styles.card} ${capped ? styles.capped : ''}`}>
              <div className={styles.iconWrap}>
                <span className={styles.glow} aria-hidden="true" />
                <PlayCircle size={22} />
              </div>

              <div className={styles.body}>
                <h3>{ad.label}</h3>
                <p>{ad.description}</p>

                <div className={styles.rewardRow}>
                  <span className={styles.rewardBadge}>
                    <Gem size={13} /> +{ad.gems} Gems
                  </span>
                  <span className={styles.duration}>~{ad.durationSeconds}s</span>
                </div>

                <div className={styles.limitRow}>
                  <div className={styles.limitTrack}>
                    <div className={styles.limitFill} style={{ width: `${progressPct}%` }} />
                  </div>
                  <span className={styles.limitLabel}>
                    {capped ? 'Daily limit reached' : `${watched}/${ad.dailyLimit} watched today`}
                  </span>
                </div>

                <button
                  type="button"
                  className={capped ? styles.ctaDisabled : styles.cta}
                  disabled={capped}
                  onClick={() => onWatch(ad)}
                >
                  {capped ? (
                    'Come back tomorrow'
                  ) : (
                    <>
                      <Sparkles size={14} /> Watch Ad
                    </>
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.otherHead}>
        <span>More ways to earn Gems</span>
      </div>
      <div className={styles.otherGrid}>
        {gemEarnActions.map((action) => (
          <Link key={action.id} to={action.to} className={styles.otherCard}>
            <span className={styles.otherReward}>
              <Gem size={13} /> +{action.gems}
            </span>
            <div className={styles.otherBody}>
              <h4>{action.label}</h4>
              <p>{action.description}</p>
            </div>
            <span className={styles.otherCta}>
              {action.cta} <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
