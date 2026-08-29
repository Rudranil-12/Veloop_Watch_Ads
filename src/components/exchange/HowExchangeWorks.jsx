import { howItWorksSteps } from '../../data/exchangeData';
import styles from './HowExchangeWorks.module.css';

export default function HowExchangeWorks() {
  return (
    <section className={styles.wrap} aria-labelledby="how-it-works-heading">
      <h2 id="how-it-works-heading" className={styles.heading}>How the exchange works</h2>
      <ol className={styles.steps}>
        {howItWorksSteps.map((step, i) => (
          <li key={step.id} className={styles.step}>
            <span className={`${styles.index} num`}>{String(step.id).padStart(2, '0')}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
            {i < howItWorksSteps.length - 1 && <span className={styles.connector} aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </section>
  );
}
