import styles from './CharCounter.module.css';

interface CharCounterProps {
  current: number;
  max: number;
}

export function CharCounter({ current, max }: CharCounterProps) {
  const isDanger = current >= max * 0.95;
  const isWarning = !isDanger && current >= max * 0.8;

  const className = isDanger
    ? styles.danger
    : isWarning
    ? styles.warning
    : styles.counter;

  return (
    <span aria-live="polite" className={className}>
      {current} / {max}
    </span>
  );
}
