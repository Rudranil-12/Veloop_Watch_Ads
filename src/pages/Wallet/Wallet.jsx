import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WalletMinimal, Gem, Coins, ArrowRight, ShieldCheck } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { withdrawMethods } from '../../data/exchangeData';
import { useAppData } from '../../context/AppDataContext';
import styles from './Wallet.module.css';

export default function Wallet() {
  const { balance, withdrawals, requestWithdrawal } = useAppData();
  const [method, setMethod] = useState(withdrawMethods[0].id);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const selectedMethod = withdrawMethods.find((m) => m.id === method);
  const recent = useMemo(() => withdrawals.slice(0, 4), [withdrawals]);

  const handleWithdraw = (e) => {
    e.preventDefault();
    const value = Number(amount);
    setSuccess(false);
    if (!value || value <= 0) {
      setError('Enter a valid VE amount.');
      return;
    }
    if (value < selectedMethod.min) {
      setError(`Minimum withdrawal for ${selectedMethod.label} is ${selectedMethod.min} VEs.`);
      return;
    }
    if (value > balance.ves) {
      setError('You don\u2019t have enough VEs for this withdrawal.');
      return;
    }
    setError('');
    requestWithdrawal(value, selectedMethod.label);
    setAmount('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="container">
      <PageHeader
        eyebrow="Live · Wallet"
        icon={WalletMinimal}
        title="Manage your balance"
        description="Track your Gems and VEs, and withdraw VEs to your preferred payout method."
      />

      <div className={styles.balanceRow}>
        <div className={`${styles.balanceCard} ${styles.gemCard}`}>
          <Gem size={20} />
          <div>
            <span>Available Gems</span>
            <strong className="num">{balance.gems.toLocaleString('en-IN')}</strong>
          </div>
        </div>
        <div className={`${styles.balanceCard} ${styles.veCard}`}>
          <Coins size={20} />
          <div>
            <span>Available VEs</span>
            <strong className="num">{balance.ves.toLocaleString('en-IN')}</strong>
          </div>
        </div>
        <Link to="/" className={styles.convertCard}>
          <span>Need more VEs?</span>
          <strong>Convert Gems <ArrowRight size={14} /></strong>
        </Link>
      </div>

      <div className={styles.splitRow}>
        <form className={styles.withdrawForm} onSubmit={handleWithdraw}>
          <h2>Withdraw VEs</h2>

          <label className={styles.field}>
            <span>Payout method</span>
            <div className={styles.methodGrid}>
              {withdrawMethods.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  className={`${styles.methodBtn} ${method === m.id ? styles.methodActive : ''}`}
                  onClick={() => setMethod(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </label>

          <label className={styles.field}>
            <span>Amount (VEs)</span>
            <input
              type="number"
              min="0"
              placeholder={`Min ${selectedMethod.min} VEs`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>

          <p className={styles.noteText}><ShieldCheck size={13} /> {selectedMethod.note}</p>

          {error && <p className={styles.errorText}>{error}</p>}
          {success && <p className={styles.successText}>Withdrawal requested — check Withdraw History for status.</p>}

          <button type="submit" className={styles.submitBtn}>Request withdrawal</button>
        </form>

        <div className={styles.recentPanel}>
          <div className={styles.recentHead}>
            <h2>Recent withdrawals</h2>
            <Link to="/withdraw-history" className={styles.viewAll}>View all</Link>
          </div>
          <ul className={styles.recentList}>
            {recent.map((w, i) => (
              <motion.li
                key={w.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
              >
                <div>
                  <strong className="num">{w.amountVEs.toLocaleString('en-IN')} VEs</strong>
                  <span>{w.method}</span>
                </div>
                <span className={`${styles.statusTag} ${styles[`status-${w.status}`]}`}>
                  {w.status === 'processing' ? 'Processing' : w.status === 'completed' ? 'Completed' : 'Failed'}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
