import { WordEntry } from '../../lib/analyzeFrequency';
import styles from './FrequencyTable.module.css';

interface FrequencyTableProps {
  entries: WordEntry[] | null;
}

export function FrequencyTable({ entries }: FrequencyTableProps) {
  if (entries === null) return null;

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Palavra</th>
            <th className={styles.th}>Frequência</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(({ word, count }) => (
            <tr key={word}>
              <td className={styles.td}>{word}</td>
              <td className={styles.td}>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
