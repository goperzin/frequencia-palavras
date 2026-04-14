import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string | null;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (message === null) return null;

  return (
    <p role="alert" className={styles.error}>
      {message}
    </p>
  );
}
