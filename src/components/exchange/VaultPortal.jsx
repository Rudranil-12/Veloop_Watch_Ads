import styles from './VaultPortal.module.css';

/**
 * Signature illustration for the Exchange Center: a vault-dial portal with
 * a gem crystal on one side and a VE coin on the other, connected by an
 * energy ring. Used (at different scales) in the hero and on each card.
 */
export default function VaultPortal({ size = 96, spin = true }) {
  return (
    <div
      className={styles.portal}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 120" width={size} height={size}>
        <defs>
          <radialGradient id="portalGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b7cf6" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#8b7cf6" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="gemGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a7c8ff" />
            <stop offset="100%" stopColor="#7c9cfb" />
          </linearGradient>
          <linearGradient id="coinGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f6d99a" />
            <stop offset="100%" stopColor="#e7b45c" />
          </linearGradient>
        </defs>

        <circle cx="60" cy="60" r="52" fill="url(#portalGlow)" />
        <circle
          cx="60" cy="60" r="46"
          fill="none" stroke="rgba(168,175,199,0.28)" strokeWidth="1"
          strokeDasharray="2 6"
          className={spin ? styles.ring : ''}
        />
        <circle cx="60" cy="60" r="36" fill="none" stroke="rgba(231,180,92,0.35)" strokeWidth="1.5" />

        {/* Gem */}
        <g transform="translate(34,60)">
          <polygon points="0,-13 11,-4 7,13 -7,13 -11,-4" fill="url(#gemGrad)" />
          <polygon points="0,-13 11,-4 0,4 -11,-4" fill="#c7dbff" opacity="0.6" />
        </g>

        {/* Arrow */}
        <path d="M46 60 H72" stroke="#a9afc7" strokeWidth="2" strokeLinecap="round" />
        <path d="M67 55 L74 60 L67 65" fill="none" stroke="#a9afc7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Coin */}
        <g transform="translate(88,60)">
          <circle r="14" fill="url(#coinGrad)" />
          <circle r="14" fill="none" stroke="#fff3d9" strokeOpacity="0.5" strokeWidth="1" />
          <text x="0" y="4" textAnchor="middle" fontSize="12" fontFamily="Space Grotesk, sans-serif" fill="#1c1508" fontWeight="700">V</text>
        </g>
      </svg>
    </div>
  );
}
