import { CharCounter } from '../CharCounter/CharCounter';
import { TranslateButton } from '../TranslateButton/TranslateButton';
import styles from './TextInputSection.module.css';

interface TextInputSectionProps {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  maxLength: number;
}

export function TextInputSection({ value, onChange, onSubmit, maxLength }: TextInputSectionProps) {
  return (
    <div className={styles.wrapper}>
      <label htmlFor="text-input" className={styles.label}>
        Texto para análise
      </label>
      <textarea
        id="text-input"
        className={styles.textarea}
        aria-label="Texto para análise"
        rows={10}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className={styles.footer}>
        <CharCounter current={value.length} max={maxLength} />
        <TranslateButton onClick={onSubmit} />
      </div>
    </div>
  );
}
