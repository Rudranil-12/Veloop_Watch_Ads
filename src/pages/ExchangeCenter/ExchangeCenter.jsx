import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Reveal from '../../components/common/Reveal';
import ExchangeHero from '../../components/exchange/ExchangeHero';
import BalanceOverview from '../../components/exchange/BalanceOverview';
import TodayAtGlance from '../../components/exchange/TodayAtGlance';
import EarnGems from '../../components/exchange/EarnGems';
import AdWatchModal from '../../components/exchange/AdWatchModal';
import ExchangeCard from '../../components/exchange/ExchangeCard';
import ExchangeModal from '../../components/exchange/ExchangeModal';
import HowExchangeWorks from '../../components/exchange/HowExchangeWorks';
import ExchangeHistory from '../../components/exchange/ExchangeHistory';
import DailyGoalCard from '../../components/exchange/DailyGoalCard';
import ExchangeRules from '../../components/exchange/ExchangeRules';
import ExchangeLoader from '../../components/exchange/ExchangeLoader';
import { EmptyState, ErrorState } from '../../components/exchange/ExchangeStatePanels';
import InfoTip from '../../components/exchange/InfoTip';
import { useAppData } from '../../context/AppDataContext';
import {
  exchangeOptions,
  adRewardOptions,
  infoTooltips,
} from '../../data/exchangeData';
import styles from './ExchangeCenter.module.css';

// Simulated fetch statuses: 'loading' | 'ready' | 'empty' | 'error'
// In production, replace loadOptions() with a real API call to the
// exchange-options endpoint and keep the same status transitions.
export default function ExchangeCenter() {
  const {
    balance, setBalance, history, recordConversion, recordAdWatch,
    adWatchCounts, adResetAt,
  } = useAppData();
  const [fetchStatus, setFetchStatus] = useState('loading');
  const [options, setOptions] = useState([]);

  const [activeOption, setActiveOption] = useState(null);
  const [modalStatus, setModalStatus] = useState(null); // review | insufficient | processing | success

  const [activeAd, setActiveAd] = useState(null);

  const loadOptions = () => {
    setFetchStatus('loading');
    setTimeout(() => {
      setOptions(exchangeOptions);
      setFetchStatus(exchangeOptions.length ? 'ready' : 'empty');
    }, 900);
  };

  useEffect(loadOptions, []);

  const handleSelect = (option) => {
    setActiveOption(option);
    setModalStatus(balance.gems >= option.requiredGems ? 'review' : 'insufficient');
  };

  const closeModal = () => {
    if (modalStatus === 'processing') return;
    setActiveOption(null);
    setModalStatus(null);
  };

  const confirmConversion = () => {
    if (!activeOption) return;
    setModalStatus('processing');
    // Simulated network delay; prevents double conversion via disabled UI state.
    setTimeout(() => {
      setBalance((prev) => ({
        gems: prev.gems - activeOption.requiredGems,
        ves: prev.ves + activeOption.receiveVEs,
      }));
      recordConversion(activeOption, 'completed');
      setModalStatus('success');
    }, 1400);
  };

  const handleWatchAd = (ad) => setActiveAd(ad);

  const closeAdModal = () => setActiveAd(null);

  const collectAdReward = (gemsEarned) => {
    setBalance((prev) => ({ ...prev, gems: prev.gems + gemsEarned }));
    recordAdWatch(activeAd, gemsEarned);
    setActiveAd(null);
  };

  const cards = useMemo(
    () => options.map((opt, i) => (
      <motion.div
        key={opt.id}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4, delay: Math.min(i, 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      >
        <ExchangeCard option={opt} userGems={balance.gems} onSelect={handleSelect} />
      </motion.div>
    )),
    [options, balance.gems],
  );

  return (
    <div className={styles.page}>
      <div className="container">
        <ExchangeHero />
        <Reveal><BalanceOverview gems={balance.gems} ves={balance.ves} /></Reveal>

        <Reveal delay={0.05}><TodayAtGlance /></Reveal>

        <Reveal delay={0.05}>
          <EarnGems ads={adRewardOptions} watchCounts={adWatchCounts} resetAt={adResetAt} onWatch={handleWatchAd} />
        </Reveal>

        <Reveal as="section" delay={0.05} aria-labelledby="conversions-heading">
          <div className={styles.sectionHead}>
            <h2 id="conversions-heading">
              Available Conversions
              <InfoTip label="exchange rate" text={infoTooltips.rate} />
            </h2>
            <p>Pick a conversion below to turn eligible Gems into VEs.</p>
          </div>

          {fetchStatus === 'loading' && <ExchangeLoader />}
          {fetchStatus === 'empty' && <EmptyState />}
          {fetchStatus === 'error' && <ErrorState onRetry={loadOptions} />}
          {fetchStatus === 'ready' && <div className={styles.grid}>{cards}</div>}
        </Reveal>

        <Reveal><HowExchangeWorks /></Reveal>
        <Reveal><ExchangeHistory items={history} /></Reveal>
        <Reveal><DailyGoalCard /></Reveal>
        <Reveal><ExchangeRules /></Reveal>
      </div>

      {modalStatus && (
        <ExchangeModal
          option={activeOption}
          balance={balance}
          status={modalStatus}
          onConfirm={confirmConversion}
          onClose={closeModal}
        />
      )}

      {activeAd && (
        <AdWatchModal ad={activeAd} onComplete={collectAdReward} onClose={closeAdModal} />
      )}
    </div>
  );
}