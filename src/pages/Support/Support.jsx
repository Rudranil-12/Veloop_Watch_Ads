import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeBuoy, MessageCircle, Mail, BookOpen, ChevronDown, Send, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { supportFaqs, supportChannels } from '../../data/exchangeData';
import styles from './Support.module.css';

const CHANNEL_ICONS = { chat: MessageCircle, email: Mail, help: BookOpen };

export default function Support() {
  const [openFaq, setOpenFaq] = useState(supportFaqs[0].id);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSent(true);
    setMessage('');
    setTimeout(() => setSent(false), 3200);
  };

  return (
    <div className="container">
      <PageHeader
        eyebrow="Live · Support"
        icon={LifeBuoy}
        title="We're here to help"
        description="Reach the VELOOP support team, or browse quick answers to common questions."
      />

      <div className={styles.channelRow}>
        {supportChannels.map((c) => {
          const Icon = CHANNEL_ICONS[c.id] ?? MessageCircle;
          return (
            <div key={c.id} className={styles.channelCard}>
              <span className={styles.channelIcon}><Icon size={17} /></span>
              <div>
                <strong>{c.label}</strong>
                <p>{c.detail}</p>
              </div>
              <span className={`${styles.statusDot} ${c.status === 'online' ? styles.dotOnline : styles.dotAvailable}`} />
            </div>
          );
        })}
      </div>

      <div className={styles.splitRow}>
        <section className={styles.faqPanel}>
          <h2>Frequently asked questions</h2>
          <div className={styles.faqList}>
            {supportFaqs.map((f) => {
              const open = openFaq === f.id;
              return (
                <div key={f.id} className={styles.faqItem}>
                  <button type="button" className={styles.faqQ} onClick={() => setOpenFaq(open ? null : f.id)}>
                    {f.q}
                    <ChevronDown size={16} className={open ? styles.chevOpen : ''} />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.p
                        className={styles.faqA}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                      >
                        {f.a}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <h2>Send us a message</h2>
          <textarea
            placeholder="Describe your issue and we'll get back to you shortly…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
          />
          <button type="submit" className={styles.sendBtn}>
            <Send size={14} /> Send message
          </button>
          <AnimatePresence>
            {sent && (
              <motion.p
                className={styles.sentNote}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                <CheckCircle2 size={14} /> Message sent — our team typically replies within a couple of hours.
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
