import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ListChecks, CheckCircle2, Lock, Gem, Zap } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { tasksData } from '../../data/exchangeData';
import { useAppData } from '../../context/AppDataContext';
import styles from './Tasks.module.css';

const FILTERS = ['All', 'Daily', 'Weekly', 'Milestone'];

export default function Tasks() {
  const { setBalance, pushActivity, pushNotification } = useAppData();
  const [tasks, setTasks] = useState(tasksData);
  const [filter, setFilter] = useState('All');
  const [claimedIds, setClaimedIds] = useState([]);

  const visible = useMemo(
    () => (filter === 'All' ? tasks : tasks.filter((t) => t.category === filter)),
    [tasks, filter],
  );

  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  const handleClaim = (task) => {
    if (task.status !== 'completed' || claimedIds.includes(task.id)) return;
    setClaimedIds((prev) => [...prev, task.id]);
    setBalance((prev) => ({ ...prev, gems: prev.gems + task.reward }));
    pushActivity({ label: 'Task reward claimed', detail: `+${task.reward} Gems · ${task.title}`, tone: 'gold' });
    pushNotification({ title: 'Task reward claimed', body: `${task.title} rewarded +${task.reward} Gems.`, tone: 'gold' });
  };

  const handleAdvance = (task) => {
    if (task.status !== 'active') return;
    setTasks((prev) => prev.map((t) => {
      if (t.id !== task.id) return t;
      const nextProgress = Math.min(t.target, t.progress + 1);
      return { ...t, progress: nextProgress, status: nextProgress >= t.target ? 'completed' : 'active' };
    }));
  };

  return (
    <div className="container">
      <PageHeader
        eyebrow="Live · Tasks"
        icon={Zap}
        title="Complete tasks, earn Gems"
        description="Finish daily and weekly tasks to top up your Gem balance. Progress updates in real time as you complete activities."
        actions={<span className={styles.summary}>{completedCount}/{tasks.length} completed today</span>}
      />

      <div className={styles.filters}>
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {visible.map((task, i) => {
          const pct = Math.round((task.progress / task.target) * 100);
          const claimed = claimedIds.includes(task.id);
          return (
            <motion.article
              key={task.id}
              className={`${styles.card} ${styles[`state-${task.status}`]}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <div className={styles.cardHead}>
                <span className={styles.badgeCat}>{task.category}</span>
                {task.status === 'completed' && <CheckCircle2 size={17} className={styles.doneIcon} />}
                {task.status === 'locked' && <Lock size={15} className={styles.lockIcon} />}
              </div>

              <h3>{task.title}</h3>
              <p>{task.description}</p>

              <div className={styles.progressRow}>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                </div>
                <span className={styles.progressLabel}>{task.progress}/{task.target}</span>
              </div>

              <div className={styles.footer}>
                <span className={styles.reward}>
                  <Gem size={13} /> +{task.reward} {task.unit}
                </span>

                {task.status === 'locked' && <span className={styles.lockedLabel}>Locked</span>}

                {task.status === 'active' && (
                  <button type="button" className={styles.progressBtn} onClick={() => handleAdvance(task)}>
                    Log progress
                  </button>
                )}

                {task.status === 'completed' && (
                  <button
                    type="button"
                    className={claimed ? styles.claimedBtn : styles.claimBtn}
                    onClick={() => handleClaim(task)}
                    disabled={claimed}
                  >
                    {claimed ? 'Claimed' : 'Claim reward'}
                  </button>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>

      {visible.length === 0 && (
        <div className={styles.empty}>
          <ListChecks size={22} />
          <p>No tasks in this category right now.</p>
        </div>
      )}
    </div>
  );
}
