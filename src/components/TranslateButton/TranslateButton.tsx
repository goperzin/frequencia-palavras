import styles from './TranslateButton.module.css';

interface TranslateButtonProps {
  onClick: () => void;
}

export function TranslateButton({ onClick }: TranslateButtonProps) {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      aria-label="Analisar frequência de palavras"
    >
      Translate
    </button>
  );
}
