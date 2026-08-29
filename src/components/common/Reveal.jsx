import { motion } from 'framer-motion';

/**
 * Fades + slides a section into place the first time it scrolls into view.
 * Wrap any section with this instead of hand-rolling whileInView props so
 * the whole app scrolls consistently.
 */
export default function Reveal({ children, delay = 0, y = 22, className, as = 'div', ...rest }) {
  const MotionTag = motion[as] ?? motion.div;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
